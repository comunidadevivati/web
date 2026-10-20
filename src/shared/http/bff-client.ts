import ky from 'ky';

// Rotas de sessão (/auth/*): o 401 delas faz parte do contrato (ex.: /auth/me sem sessão).
const AUTH_PATH_PREFIX = '/auth/';

type UnauthorizedListener = () => void;

let unauthorizedListener: UnauthorizedListener | null = null;

// Registra quem trata a sessão expirada (HTTP 401) nas demais chamadas ao BFF.
export const setBffUnauthorizedListener = (listener: UnauthorizedListener) => {
  unauthorizedListener = listener;
};

// Cliente do BFF (/auth/* e /api/v1/*). Em produção o Worker repassa as rotas ao BFF na mesma origem do front (no dev, o
// proxy do Vite), então o cookie de sessão HttpOnly segue automaticamente, sem CORS.
export const bffClient = ky.create({
  prefix: '/',
  timeout: 10_000,
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set('Accept', 'application/json');
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        const { pathname } = new URL(request.url);

        if (response.status === 401 && !pathname.startsWith(AUTH_PATH_PREFIX)) {
          unauthorizedListener?.();
        }
      },
    ],
  },
});
