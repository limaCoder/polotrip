import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { fromNodeHeaders } from 'better-auth/node';

import { authenticate } from '@/http/middlewares/authenticate';
import { UnauthorizedError } from '@/http/errors';
import { deletePhotos } from '@/app/functions/delete-photos';

const paramsSchema = z.object({
  albumId: z.string(),
});

const bodySchema = z.object({
  photoIds: z.array(z.string()),
});

type DeletePhotosParams = z.infer<typeof paramsSchema>;
type DeletePhotosBody = z.infer<typeof bodySchema>;

export const deletePhotosRoute: FastifyPluginAsyncZod = async app => {
  app.delete<{
    Params: DeletePhotosParams;
    Body: DeletePhotosBody;
  }>(
    '/albums/:albumId/photos',
    {
      onRequest: [authenticate],
      schema: {
        params: paramsSchema,
        body: bodySchema,
        response: {
          200: z.object({
            deletedCount: z.number(),
            album: z.object({
              id: z.string(),
              userId: z.string(),
              title: z.string(),
              description: z.string().nullable(),
              coverImageUrl: z.string().nullable(),
              spotifyTrackId: z.string().nullable(),
              spotifyPlaylistId: z.string().nullable(),
              isPublished: z.boolean(),
              isPaid: z.boolean(),
              currentStepAfterPayment: z.string(),
              shareableLink: z.string(),
              photoCount: z.number(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
          400: z.object({
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
        const { photoIds } = request.body;

        if (!photoIds.length) {
          return reply.status(400).send({
            message: 'No photos specified for deletion',
          });
        }

        try {
          const result = await deletePhotos({
            albumId,
            userId,
            photoIds,
          });

          return result;
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'Album not found') {
              return reply.status(404).send({ message: error.message });
            }
            if (error.message === 'Album does not belong to the user') {
              return reply.status(403).send({ message: error.message });
            }
          }
          throw error;
        }
      } catch (error) {
        app.log.error('Error deleting photos:', error);
        reply.status(500).send({ error: 'Failed to delete photos' });
      }
    },
  );
};
