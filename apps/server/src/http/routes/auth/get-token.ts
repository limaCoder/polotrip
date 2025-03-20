import { db } from '@polotrip/db';
import { users } from '@polotrip/db/schema';
import { eq } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UnauthorizedError } from '@/http/errors';

export const getToken: FastifyPluginAsyncZod = async app => {
  app.post('/auth/token', async (request, reply) => {
    const { refreshToken } = request.cookies;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token not supplied', 'REFRESH_TOKEN_MISSING');
    }

    try {
      const decoded = app.jwt.verify(refreshToken) as { sub: string };
      const userId = decoded.sub;

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId as string))
        .then(rows => rows[0]);

      if (!user) {
        throw new UnauthorizedError('User not found', 'USER_NOT_FOUND');
      }

      const accessToken = app.jwt.sign(
        {
          sub: user.id,
          name: user.name,
          email: user.email,
          iat: Math.floor(Date.now() / 1000),
        },
        { expiresIn: '5m', iss: 'polotrip-api' },
      );

      const newRefreshToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

      reply.setCookie('refreshToken', newRefreshToken, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return { accessToken, refreshTokenRotated: true };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      app.log.error(
        {
          error:
            error instanceof Error
              ? {
                  message: error.message,
                  stack: error.stack,
                }
              : error,
        },
        'Error when checking refresh token',
      );

      throw new UnauthorizedError('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN', {
        originalError: errorMessage,
      });
    }
  });
};
