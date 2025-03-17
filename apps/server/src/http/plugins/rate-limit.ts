import { FastifyInstance } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import { TooManyRequestsError } from '../errors';

export async function setupRateLimit(app: FastifyInstance) {
  await app.register(fastifyRateLimit, {
    global: true,
    max: 100, // global limit
    timeWindow: '1 minute',
    errorResponseBuilder: () => {
      const error = new TooManyRequestsError(
        'Many requests were made in a short time.',
        'RATE_LIMIT_EXCEEDED',
        {
          suggestion: 'Please, try again later.',
        },
      );
      return error.toResponse();
    },
  });

  // Add specific rate limits for sensitive routes
  app.addHook('onRoute', routeOptions => {
    if (routeOptions.method === 'POST' && routeOptions.url === '/auth/token') {
      routeOptions.config = routeOptions.config || {};
      routeOptions.config.rateLimit = {
        max: 20,
        timeWindow: '1 minute',
        keyGenerator: function (request) {
          return `${request.ip}-${request.cookies.refreshToken || 'no-token'}`;
        },
      };
    }

    if (routeOptions.method === 'POST' && routeOptions.url === '/auth/sync-user') {
      routeOptions.config = routeOptions.config || {};
      routeOptions.config.rateLimit = {
        max: 10,
        timeWindow: '1 minute',
        keyGenerator: function (request) {
          return request.ip;
        },
      };
    }
  });
}
