import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getAlbumById } from '@/app/functions/get-album-by-id';
import { authenticate } from '@/http/middlewares/authenticate';

const paramsSchema = z.object({
  id: z.string(),
});

type GetAlbumByIdParams = z.infer<typeof paramsSchema>;

export const getAlbumByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get<{
    Params: GetAlbumByIdParams;
  }>(
    '/api/album/:id',
    {
      onRequest: [authenticate],
      schema: {
        params: paramsSchema,
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
              user: z
                .object({
                  id: z.string(),
                  name: z.string(),
                  avatarUrl: z.string().nullable(),
                })
                .nullable(),
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
            photosByDate: z.record(
              z.string(),
              z.array(
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
            ),
            mapCoordinates: z.array(
              z.object({
                id: z.string(),
                latitude: z.number(),
                longitude: z.number(),
                locationName: z.string().nullable(),
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

        const result = await getAlbumById({
          albumId,
        });

        return result;
      } catch (error) {
        console.error('Erro ao buscar álbum:', error);
        return reply.status(400).send({
          message: error instanceof Error ? error.message : 'Erro ao buscar álbum',
        });
      }
    },
  );
};
