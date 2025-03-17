import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const bodySchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  image: z.string().nullable().optional(),
  provider: z.enum(['google', 'apple']),
  providerAccountId: z.string(),
});

type SyncUserBody = z.infer<typeof bodySchema>;

export const syncUserRoute: FastifyPluginAsyncZod = async app => {
  app.post<{
    Body: SyncUserBody;
  }>(
    '/auth/sync-user',
    {
      schema: {
        body: bodySchema,
        response: {
          200: z.object({
            accessToken: z.string(),
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              avatarUrl: z.string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id, email, name, image, provider, providerAccountId } = request.body;

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then(rows => rows[0]);

      let user;

      if (existingUser) {
        const [updatedUser] = await db
          .update(users)
          .set({
            name,
            avatarUrl: image || existingUser.avatarUrl,
            provider,
            providerUserId: providerAccountId,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingUser.id))
          .returning();

        user = updatedUser;
      }

      if (!user) {
        const [newUser] = await db
          .insert(users)
          .values({
            id,
            name,
            email,
            avatarUrl: image,
            provider,
            providerUserId: providerAccountId,
          })
          .returning();

        user = newUser;
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

      const refreshToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

      reply.setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      };
    },
  );
};
