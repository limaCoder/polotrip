import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import DOMPurify from 'isomorphic-dompurify';

import { updateAlbum } from '@/app/functions/update-album';
import { authenticate } from '@/http/middlewares/authenticate';
import { fromNodeHeaders } from 'better-auth/node';
import { UnauthorizedError } from '@/http/errors';
import { sanitizeNonNullable, sanitizeNullable } from '@/app/utils/sanitize';

const paramsSchema = z.object({
  id: z.string(),
});

const bodySchema = z.object({
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
        dateTaken: z.string().nullable().optional(),
        locationName: z.string().nullable().optional(),
        latitude: z.number().nullable().optional(),
        longitude: z.number().nullable().optional(),
        description: z.string().nullable().optional(),
        order: z.string().nullable().optional(),
      }),
    )
    .optional(),
  currentStepAfterPayment: z.string().nullable().optional(),
});

type UpdateAlbumParams = z.infer<typeof paramsSchema>;
type UpdateAlbumBody = z.infer<typeof bodySchema>;

export const updateAlbumRoute: FastifyPluginAsyncZod = async app => {
  app.patch<{
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
              isPaid: z.boolean(),
              currentStepAfterPayment: z.string(),
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
        const session = await request.server.auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        if (!session) {
          throw new UnauthorizedError();
        }

        const userId = session.user.id;

        const { id: albumId } = request.params;
        const {
          title,
          description,
          coverImageUrl,
          spotifyTrackId,
          spotifyPlaylistId,
          isPublished,
          photoUpdates,
          currentStepAfterPayment,
        } = request.body;

        const sanitizedInput = {
          albumId: DOMPurify.sanitize(albumId),
          title: sanitizeNonNullable(title),
          description: sanitizeNullable(description),
          coverImageUrl: sanitizeNullable(coverImageUrl),
          spotifyTrackId: sanitizeNullable(spotifyTrackId),
          spotifyPlaylistId: sanitizeNullable(spotifyPlaylistId),
          isPublished,
          photoUpdates: photoUpdates ?? [],
          currentStepAfterPayment: sanitizeNonNullable(
            currentStepAfterPayment as string | undefined,
          ),
        };

        const result = await updateAlbum({
          albumId: sanitizedInput.albumId,
          userId,
          title: sanitizedInput.title,
          description: sanitizedInput.description,
          coverImageUrl: sanitizedInput.coverImageUrl,
          spotifyTrackId: sanitizedInput.spotifyTrackId,
          spotifyPlaylistId: sanitizedInput.spotifyPlaylistId,
          isPublished: sanitizedInput.isPublished,
          photoUpdates: sanitizedInput.photoUpdates,
          currentStepAfterPayment: sanitizedInput.currentStepAfterPayment,
        });

        return result;
      } catch (error) {
        app.log.error('Error updating album:', error);

        reply.status(500).send({ error: 'Failed to process the request.' });
      }
    },
  );
};
