import { env } from '../../app/config/env'
import ky from 'ky'

export const apiClient = ky.create({
  prefix: env.VITE_API_URL,
  timeout: 10_000,
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set('Accept', 'application/json')
      },
    ],
  },
})
