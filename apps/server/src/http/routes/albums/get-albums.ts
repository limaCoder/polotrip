import z from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getAlbumsByUserId } from '@/app/functions/get-albums-by-user-id';
import { authenticate } from '@/http/middlewares/authenticate';
import { fromNodeHeaders } from 'better-auth/node';
import { UnauthorizedError } from '@/http/errors';

const getAlbumsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/albums',
    {
      onRequest: [authenticate],
      schema: {
        response: {
          200: z.object({
            albums: z.array(
              z.object({
                id: z.string(),
                userId: z.string(),
                title: z.string(),
                description: z.string().nullable(),
                coverImageUrl: z.string().nullable(),
                spotifyTrackId: z.string().nullable(),
                spotifyPlaylistId: z.string().nullable(),
                isPublished: z.boolean(),
                shareableLink: z.string(),
                photoCount: z.number(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }),
            ),
          }),
        },
      },
    },
    async request => {
      const session = await request.server.auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session) {
        throw new UnauthorizedError();
      }

      const { albums } = await getAlbumsByUserId({
        userId: session.user.id,
      });

      return { albums };
    },
  );
};

export { getAlbumsRoute };
