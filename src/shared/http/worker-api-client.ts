import ky from 'ky';

// Cliente para os endpoints /api/* do próprio Worker da Cloudflare (mesma origem do front).
export const workerApiClient = ky.create({
  prefix: '/api',
  timeout: 15_000,
  retry: 0,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set('Accept', 'application/json');
      },
    ],
  },
});
