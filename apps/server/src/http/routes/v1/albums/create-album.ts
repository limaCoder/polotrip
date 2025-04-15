import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import DOMPurify from 'isomorphic-dompurify';

import { createAlbum } from '@/app/functions/create-album';
import { authenticate } from '@/http/middlewares/authenticate';
import { fromNodeHeaders } from 'better-auth/node';
import { UnauthorizedError } from '@/http/errors';

const bodySchema = z.object({
  title: z.string().min(3).max(255),
  date: z.string(),
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
              date: z.string(),
              description: z.string().nullable(),
              coverImageUrl: z.string().nullable(),
              spotifyTrackId: z.string().nullable().optional(),
              spotifyPlaylistId: z.string().nullable().optional(),
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
      try {
        const session = await request.server.auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        if (!session) {
          throw new UnauthorizedError();
        }

        const userId = session.user.id;

        const { title, coverImageUrl, description, date } = request.body;

        const sanitizedInput = {
          title: DOMPurify.sanitize(title),
          description: DOMPurify.sanitize(description ?? ''),
          coverImageUrl: DOMPurify.sanitize(coverImageUrl ?? ''),
        };

        const { album } = await createAlbum({
          userId,
          title: sanitizedInput?.title,
          date,
          description: sanitizedInput?.description,
          coverImageUrl: sanitizedInput?.coverImageUrl,
        });

        return reply.status(201).send({ album });
      } catch (error) {
        app.log.error('Error when creating album:', error);

        reply.status(500).send({ error: 'Failed to process the request.' });
      }
    },
  );
};
