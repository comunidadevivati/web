import { z } from 'zod';

/*
 * Worker da Comunidade Viva Web.
 *
 * Os assets estáticos (SPA) são servidos diretamente pela Cloudflare; este Worker só executa
 * para /api/* (ver `run_worker_first` em wrangler.jsonc).
 *
 * POST /api/guest-wifi/authorize
 * Libera a internet da rede "VIVA - Visitantes" no Omada Controller (External Portal Server).
 * As credenciais do Hotspot Operator ficam somente aqui, como secrets do Worker.
 * Doc: https://support.omadanetworks.com/document/132060/
 */

const GUEST_WIFI_AUTHORIZE_PATH = '/api/guest-wifi/authorize';

// Omada usa o formato AA-BB-CC-DD-EE-FF.
const macAddressSchema = z.string().regex(/^(?:[\dA-Fa-f]{2}[:-]){5}[\dA-Fa-f]{2}$/);

const clientIpSchema = z.string().max(45).optional();

const siteSchema = z.string().max(64).optional();

const guestWifiClientSchema = z.discriminatedUnion('type', [
  // Cliente sem fio, interceptado pelo access point (EAP).
  z.object({
    type: z.literal('eap'),
    clientMac: macAddressSchema,
    clientIp: clientIpSchema,
    apMac: macAddressSchema,
    ssidName: z.string().min(1).max(64),
    radioId: z.number().int().min(0).max(3),
    site: siteSchema,
  }),
  // Cliente interceptado pelo gateway (ex.: ER605).
  z.object({
    type: z.literal('gateway'),
    clientMac: macAddressSchema,
    clientIp: clientIpSchema,
    gatewayMac: macAddressSchema,
    vid: z.number().int().min(0).max(4094),
    site: siteSchema,
  }),
]);

const authorizeRequestSchema = z.object({
  client: guestWifiClientSchema,
  // Nome e telefone são validados, mas não são persistidos nem registrados em log aqui.
  // A persistência ficará a cargo do backend/BFF.
  visitor: z.object({
    fullName: z.string().trim().min(3).max(120),
    phone: z.string().regex(/^\d{10,11}$/),
  }),
  terms: z.object({
    accepted: z.literal(true),
    version: z.string().min(1).max(32),
  }),
});

type GuestWifiClient = z.infer<typeof guestWifiClientSchema>;

type OmadaResponse<TResult = unknown> = {
  errorCode: number;
  msg?: string;
  result?: TResult;
};

type OmadaSession = {
  token: string;
  cookie: string;
};

const jsonResponse = (body: unknown, status: number) => {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
};

const getControllerBaseUrl = (env: Env) => {
  return `${env.OMADA_CONTROLLER_URL.replace(/\/+$/, '')}/${env.OMADA_CONTROLLER_ID}`;
};

// Mantém apenas "nome=valor" de cada Set-Cookie (ex.: TPOMADA_SESSIONID).
const getSessionCookie = (response: Response) => {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0])
    .join('; ');
};

const loginOperator = async (env: Env): Promise<OmadaSession> => {
  const response = await fetch(`${getControllerBaseUrl(env)}/api/v2/hotspot/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: env.OMADA_OPERATOR_USERNAME,
      password: env.OMADA_OPERATOR_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Omada operator login failed with HTTP ${response.status}`);
  }

  const data = await response.json<OmadaResponse<{ token?: string }>>();

  if (data.errorCode !== 0 || !data.result?.token) {
    throw new Error(`Omada operator login failed with errorCode ${data.errorCode}`);
  }

  return {
    token: data.result.token,
    cookie: getSessionCookie(response),
  };
};

const authorizeClient = async (env: Env, session: OmadaSession, client: GuestWifiClient) => {
  const { type: _type, ...clientFields } = client;

  const response = await fetch(`${getControllerBaseUrl(env)}/api/v2/hotspot/extPortal/auth`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: session.cookie,
      'Csrf-Token': session.token,
    },
    body: JSON.stringify({
      ...clientFields,
      // Usa o site informado pelo redirecionamento do Omada; sem ele, o site configurado.
      site: clientFields.site ?? env.OMADA_SITE_ID,
      // Duração da liberação em milissegundos (Omada Controller v6.2.10+).
      time: Number(env.GUEST_WIFI_SESSION_MINUTES) * 60_000,
      authType: '4',
      originUrl: '',
    }),
  });

  if (!response.ok) {
    throw new Error(`Omada client authorization failed with HTTP ${response.status}`);
  }

  const data = await response.json<OmadaResponse>();

  if (data.errorCode !== 0) {
    throw new Error(`Omada client authorization failed with errorCode ${data.errorCode}`);
  }
};

const handleGuestWifiAuthorize = async (request: Request, env: Env) => {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  const body: unknown = await request.json().catch(() => null);

  const parsed = authorizeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return jsonResponse({ error: 'invalid_request' }, 400);
  }

  try {
    const session = await loginOperator(env);

    await authorizeClient(env, session, parsed.data.client);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    // Sem dados pessoais no log: apenas o motivo técnico da falha.
    console.error('guest-wifi: authorization failed', error instanceof Error ? error.message : '');

    return jsonResponse({ error: 'authorization_failed' }, 502);
  }
};

export default {
  fetch: async (request, env) => {
    const { pathname } = new URL(request.url);

    if (pathname === GUEST_WIFI_AUTHORIZE_PATH) {
      return handleGuestWifiAuthorize(request, env);
    }

    return jsonResponse({ error: 'not_found' }, 404);
  },
} satisfies ExportedHandler<Env>;
