import { createAlbum } from '@/app/functions/create-album';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../../middlewares/authenticate';

const bodySchema = z.object({
  userId: z.string(),
  title: z.string().min(3).max(255),
  description: z.string().max(1000).nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
});

type CreateAlbumBody = z.infer<typeof bodySchema>;

export const createAlbumRoute: FastifyPluginAsyncZod = async app => {
  app.post<{
    Body: CreateAlbumBody;
  }>(
    '/albums',
    {
      onRequest: [authenticate],
      schema: {
        body: bodySchema,
        response: {
          201: z.object({
            album: z.object({
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
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, userId, coverImageUrl, description } = request.body;

      const { album } = await createAlbum({
        userId,
        title,
        description,
        coverImageUrl,
      });

      return reply.status(201).send({ album });
    },
  );
};
