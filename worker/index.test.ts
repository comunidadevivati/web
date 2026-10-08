// @vitest-environment node
import worker from '@worker/index';
import { afterEach, describe, expect, it, vi } from 'vitest';

const env = {
  GUEST_WIFI_SESSION_MINUTES: '240',
  OMADA_CONTROLLER_URL: 'https://controller.example.com/',
  OMADA_CONTROLLER_ID: 'omadac-id',
  OMADA_SITE_ID: 'configured-site-id',
  OMADA_OPERATOR_USERNAME: 'operator',
  OMADA_OPERATOR_PASSWORD: 'secret',
} as unknown as Env;

const validBody = {
  client: {
    type: 'eap',
    clientMac: 'AA-BB-CC-DD-EE-FF',
    clientIp: '192.168.10.20',
    apMac: '11-22-33-44-55-66',
    ssidName: 'VIVA - Visitantes',
    radioId: 1,
    site: 'Default',
  },
  visitor: {
    fullName: 'Maria da Silva',
    phone: '67991066631',
  },
  terms: {
    accepted: true,
    version: '2026-10-07',
  },
};

const authorizeRequest = (body: unknown, method = 'POST') => {
  return new Request('https://viva.example.com/api/guest-wifi/authorize', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });
};

const callWorker = (request: Request) => {
  return worker.fetch(request as never, env);
};

const mockOmada = (loginErrorCode = 0, authorizationErrorCode = 0) => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json(
        { errorCode: loginErrorCode, result: { token: 'csrf-token' } },
        { headers: { 'Set-Cookie': 'TPOMADA_SESSIONID=session-id; Path=/; HttpOnly' } },
      ),
    )
    .mockResolvedValueOnce(
      Response.json({ errorCode: authorizationErrorCode, msg: 'Failed to authenticate.' }),
    );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

describe('worker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('authorizes the guest client on the Omada controller', async () => {
    mockOmada();

    const response = await callWorker(authorizeRequest(validBody));

    expect(response.status).toBe(204);
  });

  it('sends the operator session to the external portal authorization', async () => {
    const fetchMock = mockOmada();

    await callWorker(authorizeRequest(validBody));

    expect(fetchMock.mock.calls[1]).toEqual([
      'https://controller.example.com/omadac-id/api/v2/hotspot/extPortal/auth',
      expect.objectContaining({
        headers: expect.objectContaining({
          Cookie: 'TPOMADA_SESSIONID=session-id',
          'Csrf-Token': 'csrf-token',
        }),
      }),
    ]);
  });

  it('never sends visitor personal data to the Omada controller', async () => {
    const fetchMock = mockOmada();

    await callWorker(authorizeRequest(validBody));

    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      clientMac: 'AA-BB-CC-DD-EE-FF',
      clientIp: '192.168.10.20',
      apMac: '11-22-33-44-55-66',
      ssidName: 'VIVA - Visitantes',
      radioId: 1,
      site: 'Default',
      time: 14_400_000,
      authType: '4',
      originUrl: '',
    });
  });

  it('falls back to the configured site when the redirect has none', async () => {
    const fetchMock = mockOmada();

    const { site: _site, ...clientWithoutSite } = validBody.client;

    await callWorker(authorizeRequest({ ...validBody, client: clientWithoutSite }));

    expect(JSON.parse(fetchMock.mock.calls[1][1].body).site).toBe('configured-site-id');
  });

  it('rejects requests without accepted terms', async () => {
    mockOmada();

    const response = await callWorker(
      authorizeRequest({ ...validBody, terms: { accepted: false, version: '2026-10-07' } }),
    );

    expect(response.status).toBe(400);
  });

  it('returns a gateway error when the operator login fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    mockOmada(-1);

    const response = await callWorker(authorizeRequest(validBody));

    expect(response.status).toBe(502);
  });

  it('reports the Omada error code when the client cannot be authorized', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    mockOmada(0, -41501);

    const response = await callWorker(authorizeRequest(validBody));

    expect(await response.json()).toEqual({
      error: 'authorization_failed',
      reason: 'omada_authorization_failed',
      omadaErrorCode: -41501,
    });
  });

  it('reports missing configuration without calling the controller', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const fetchMock = mockOmada();

    await worker.fetch(authorizeRequest(validBody) as never, {
      ...env,
      OMADA_OPERATOR_PASSWORD: '',
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('only accepts POST requests', async () => {
    const response = await callWorker(authorizeRequest(undefined, 'GET'));

    expect(response.status).toBe(405);
  });
});
