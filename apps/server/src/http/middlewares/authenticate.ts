import { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '@/http/errors';
import { fromNodeHeaders } from 'better-auth/node';

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const session = await request.server.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError('Unauthorized', 'NO_SESSION');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    request.log.error(
      {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : error,
        path: request.url,
      },
      'Error in authentication',
    );

    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError('Invalid or expired session', 'INVALID_SESSION', {
      originalError: errorMessage,
    });
  }
}

export { authenticate };
