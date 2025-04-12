import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import DOMPurify from 'isomorphic-dompurify';
import { fromNodeHeaders } from 'better-auth/node';
import { authenticate } from '@/http/middlewares/authenticate';
import { UnauthorizedError } from '@/http/errors';
import { saveUploadedPhotos } from '@/app/functions/save-uploaded-photos';

const bodySchema = z.object({
  albumId: z.string(),
  photos: z.array(
    z.object({
      filePath: z.string(),
      originalFileName: z.string(),
      dateTaken: z.string().nullable(),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
    }),
  ),
});

type SaveUploadedPhotosBody = z.infer<typeof bodySchema>;

export const uploadPhotosRoute: FastifyPluginAsyncZod = async app => {
  app.post<{
    Body: SaveUploadedPhotosBody;
  }>(
    '/albums/photos/save',
    {
      onRequest: [authenticate],
      schema: {
        body: bodySchema,
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
        const { albumId, photos: uploadedPhotosData } = request.body;

        const sanitizedAlbumId = DOMPurify.sanitize(albumId);

        try {
          const { photos: savedPhotos } = await saveUploadedPhotos({
            albumId: sanitizedAlbumId,
            userId,
            photos: uploadedPhotosData,
          });

          return { photos: savedPhotos };
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'Album not found') {
              return reply.status(404).send({ message: error.message });
            }
            if (error.message === 'Album does not belong to user') {
              return reply.status(403).send({ message: error.message });
            }
            if (error.message === 'Limite de 100 fotos por álbum excedido') {
              return reply.status(400).send({ message: error.message });
            }
          }
          throw error;
        }
      } catch (error) {
        app.log.error('Error saving uploaded photos:', error);
        reply.status(500).send({ error: 'Failed to process the request.' });
      }
    },
  );
};
