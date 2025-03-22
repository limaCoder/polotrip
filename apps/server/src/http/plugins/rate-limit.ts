import { FastifyInstance } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import { TooManyRequestsError } from '@/http/errors';

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
}
