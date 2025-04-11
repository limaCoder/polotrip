import z from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getAlbumsByUserId } from '@/app/functions/get-albums-by-user-id';
import { authenticate } from '@/http/middlewares/authenticate';
import { sendEmailWelcome } from '@/http/middlewares/send-email-welcome';
import { fromNodeHeaders } from 'better-auth/node';
import { UnauthorizedError } from '@/http/errors';
import { paginationQuerySchema, paginationResponseSchema } from '@/app/helpers/pagination/schema';
import { PaginationQuery } from '@/app/helpers/pagination/types';

const getAlbumsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/albums',
    {
      onRequest: [authenticate, sendEmailWelcome],
      schema: {
        querystring: paginationQuerySchema,
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
                isPaid: z.boolean(),
                currentStepAfterPayment: z.string().nullable(),
                shareableLink: z.string(),
                photoCount: z.number(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }),
            ),
            pagination: paginationResponseSchema.optional(),
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

        const { page, limit } = request.query as PaginationQuery;

        const result = await getAlbumsByUserId({
          userId: session.user.id,
          pagination: { page, limit },
        });

        return result;
      } catch (error) {
        app.log.error('Error when searching for albums:', error);

        reply.status(500).send({ error: 'Failed to process the request.' });
      }
    },
  );
};

export { getAlbumsRoute };
