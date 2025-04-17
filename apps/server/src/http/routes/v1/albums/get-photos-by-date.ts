import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { getPhotosByDate } from '@/app/functions/get-photos-by-date';
import { authenticate } from '@/http/middlewares/authenticate';
import { fromNodeHeaders } from 'better-auth/node';
import { UnauthorizedError } from '@/http/errors';
import { paginationQuerySchema } from '@/app/helpers/pagination/schema';

const paramsSchema = z.object({
  albumId: z.string(),
});

const querySchema = z
  .object({
    date: z.string().optional(),
    noDate: z.string().optional().default('false'),
  })
  .merge(paginationQuerySchema);

type GetPhotosByDateParams = z.infer<typeof paramsSchema>;
type GetPhotosByDateQuery = z.infer<typeof querySchema>;

export const getPhotosByDateRoute: FastifyPluginAsyncZod = async app => {
  app.get<{
    Params: GetPhotosByDateParams;
    Querystring: GetPhotosByDateQuery;
  }>(
    '/albums/:albumId/photos-by-date',
    {
      onRequest: [authenticate],
      schema: {
        params: paramsSchema,
        querystring: querySchema,
        response: {
          200: z.object({
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
            pagination: z.object({
              total: z.number(),
              page: z.number(),
              limit: z.number(),
              totalPages: z.number(),
              hasNextPage: z.boolean(),
              hasPrevPage: z.boolean(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const session = await request.server.auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        if (!session) {
          throw new UnauthorizedError();
        }

        const userId = session.user.id;
        const { albumId } = request.params;
        const { date, noDate, page, limit } = request.query;

        try {
          const result = await getPhotosByDate({
            albumId,
            userId,
            date,
            noDate: noDate === 'true',
            pagination: { page, limit },
          });

          return result;
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'Album not found') {
              return reply.status(404).send({ message: error.message });
            }
            if (error.message === 'Album does not belong to user') {
              return reply.status(403).send({ message: error.message });
            }
          }
          throw error;
        }
      } catch (error) {
        app.log.error('Error fetching photos by date:', error);
        reply.status(500).send({ error: 'Failed to fetch photos' });
      }
    },
  );
};
