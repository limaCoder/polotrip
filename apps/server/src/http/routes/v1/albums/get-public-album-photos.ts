import z from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getPublicAlbumPhotos } from '@/app/functions/get-public-album-photos';

const getPublicAlbumPhotosRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/public/albums/:id/photos',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        querystring: z.object({
          cursor: z.string().optional(),
          limit: z
            .union([z.string().regex(/^\d+$/).transform(Number), z.number()])
            .pipe(z.number().min(1).max(100))
            .default(20)
            .optional(),
        }),
        response: {
          200: z.object({
            timelineEvents: z.array(
              z.object({
                date: z.string(),
                photos: z.array(
                  z.object({
                    id: z.string(),
                    imageUrl: z.string(),
                    dateTaken: z.string().nullable(),
                    description: z.string().nullable(),
                    locationName: z.string().nullable(),
                    order: z.string().nullable(),
                  }),
                ),
              }),
            ),
            pagination: z.object({
              hasMore: z.boolean(),
              nextCursor: z.string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const { cursor, limit } = request.query as {
          cursor?: string;
          limit?: number;
        };

        const result = await getPublicAlbumPhotos({
          albumId: id,
          cursor,
          limit,
        });

        return result;
      } catch (error) {
        app.log.error('Error when fetching public album photos:', error);

        if (error instanceof Error && error.message === 'Album not found') {
          return reply.status(404).send({ error: 'Album not found' });
        }

        if (error instanceof Error && error.message === 'Album is not published') {
          return reply.status(403).send({ error: 'Album is not published' });
        }

        return reply.status(500).send({ error: 'Failed to process the request.' });
      }
    },
  );
};

export { getPublicAlbumPhotosRoute };
