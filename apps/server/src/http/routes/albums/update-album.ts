import { updateAlbum } from '@/app/functions/update-album';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../../middlewares/authenticate';

const paramsSchema = z.object({
  id: z.string(),
});

const bodySchema = z.object({
  userId: z.string(),
  title: z.string().min(3).max(255).optional(),
  description: z.string().max(1000).nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  spotifyTrackId: z.string().nullable().optional(),
  spotifyPlaylistId: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  photoUpdates: z
    .array(
      z.object({
        id: z.string(),
        locationName: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        order: z.string().nullable().optional(),
      }),
    )
    .optional(),
});

type UpdateAlbumParams = z.infer<typeof paramsSchema>;
type UpdateAlbumBody = z.infer<typeof bodySchema>;

export const updateAlbumRoute: FastifyPluginAsyncZod = async app => {
  app.put<{
    Params: UpdateAlbumParams;
    Body: UpdateAlbumBody;
  }>(
    '/albums/:id',
    {
      onRequest: [authenticate],
      schema: {
        params: paramsSchema,
        body: bodySchema,
        response: {
          200: z.object({
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
            photos: z.array(
              z.object({
                id: z.string(),
                albumId: z.string(),
                imageUrl: z.string(),
                thumbnailUrl: z.string().nullable(),
                originalFileName: z.string().nullable(),
                dateTaken: z.string().nullable(),
                latitude: z.number().nullable(),
                longitude: z.number().nullable(),
                locationName: z.string().nullable(),
                description: z.string().nullable(),
                order: z.string().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }),
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { id: albumId } = request.params;
        const {
          userId,
          title,
          description,
          coverImageUrl,
          spotifyTrackId,
          spotifyPlaylistId,
          isPublished,
          photoUpdates,
        } = request.body;

        const result = await updateAlbum({
          albumId,
          userId,
          title,
          description,
          coverImageUrl,
          spotifyTrackId,
          spotifyPlaylistId,
          isPublished,
          photoUpdates,
        });

        return result;
      } catch (error) {
        console.error('Error updating album:', error);
        return reply.status(400).send({
          message: error instanceof Error ? error.message : 'Error updating album',
        });
      }
    },
  );
};
