import { getAlbumsByUserId } from '@/app/functions/get-albums-by-user-id';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { authenticate } from '../../middlewares/authenticate';

const getAlbumsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/albums',
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
      const userId = request.user.sub;

      const { albums } = await getAlbumsByUserId({
        userId,
      });

      return { albums };
    },
  );
};

export { getAlbumsRoute };
