import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { fromNodeHeaders } from 'better-auth/node';

import { authenticate } from '@/http/middlewares/authenticate';
import { UnauthorizedError } from '@/http/errors';
import { getUploadUrls } from '@/app/functions/get-upload-urls';
import DOMPurify from 'isomorphic-dompurify';

const querySchema = z.object({
  albumId: z.string(),
  count: z.coerce.number().min(1).max(100),
});

const bodySchema = z.object({
  fileNames: z.array(z.string()).min(1),
  fileTypes: z.array(z.string()).min(1),
});

type GetUploadUrlsQuery = z.infer<typeof querySchema>;
type GetUploadUrlsBody = z.infer<typeof bodySchema>;

export const getUploadUrlsRoute: FastifyPluginAsyncZod = async app => {
  app.post<{
    Querystring: GetUploadUrlsQuery;
    Body: GetUploadUrlsBody;
  }>(
    '/albums/upload-urls',
    {
      onRequest: [authenticate],
      schema: {
        querystring: querySchema,
        body: bodySchema,
        response: {
          200: z.object({
            urls: z.array(
              z.object({
                signedUrl: z.string(),
                filePath: z.string(),
                fileName: z.string(),
              }),
            ),
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
        const { albumId } = request.query;
        const { fileNames, fileTypes } = request.body;

        if (fileNames.length !== fileTypes.length) {
          return reply.status(400).send({
            message: 'Name and file type quantity does not match',
          });
        }

        const sanitizedAlbumId = DOMPurify.sanitize(albumId);

        try {
          const { urls } = await getUploadUrls({
            albumId: sanitizedAlbumId,
            userId,
            fileNames,
            fileTypes,
          });

          return { urls };
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'Album not found') {
              return reply.status(404).send({ message: error.message });
            }
            if (error.message === 'Album does not belong to user') {
              return reply.status(403).send({ message: error.message });
            }
            if (error.message.includes('photos per album exceeded')) {
              return reply.status(400).send({ message: error.message });
            }
          }
          throw error;
        }
      } catch (error) {
        app.log.error('Error creating signed URLs:', error);
        reply.status(500).send({ error: 'Failed to generate signed URLs' });
      }
    },
  );
};
