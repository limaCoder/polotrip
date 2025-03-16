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

  // Specific configs to authentication routes
  app.after(() => {
    app.route({
      method: 'POST',
      url: '/auth/token',
      config: {
        rateLimit: {
          max: 20,
          timeWindow: '1 minute',
          keyGenerator: function (request) {
            return `${request.ip}-${request.cookies.refreshToken || 'no-token'}`;
          },
        },
      },
      handler: async () => {},
    });

    app.route({
      method: 'POST',
      url: '/auth/sync-user',
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
          keyGenerator: function (request) {
            return request.ip;
          },
        },
      },
      handler: async () => {},
    });
  });
}
