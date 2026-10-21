import { trackedFetch } from '@/shared/http/slow-requests';
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
// proxy do Vite), então o cookie de sessão HttpOnly segue automaticamente, sem CORS. O tempo limite
// cobre o repouso do Render Free: o BFF leva até ~1 min para acordar e espera a Core API por até
// 60 s. Requisições demoradas exibem o aviso "Conectando ao servidor…".
export const bffClient = ky.create({
  prefix: '/',
  timeout: 70_000,
  fetch: trackedFetch,
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    // 524: tempo limite do Cloudflare (100 s), possível se BFF e Core API acordam juntos.
    statusCodes: [408, 413, 429, 500, 502, 503, 504, 524],
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
