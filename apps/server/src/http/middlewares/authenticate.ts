import { FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../errors';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      name?: string;
      email?: string;
      iat?: number;
    };
    user: {
      sub: string;
      name?: string;
      email?: string;
      iat?: number;
    };
  }
}

async function authenticate(request: FastifyRequest) {
  try {
    await request.jwtVerify();
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

    throw new UnauthorizedError('Invalid or expired token', 'INVALID_ACCESS_TOKEN', {
      originalError: errorMessage,
    });
  }
}

export { authenticate };
