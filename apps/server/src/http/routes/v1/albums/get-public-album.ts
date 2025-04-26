import z from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getPublicAlbumById } from '@/app/functions/get-public-album-by-id';

const getPublicAlbumRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/public/albums/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            album: z.object({
              id: z.string(),
              title: z.string(),
              description: z.string().nullable(),
              coverImageUrl: z.string().nullable(),
              date: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const result = await getPublicAlbumById({ id });

        return result;
      } catch (error) {
        app.log.error('Error when fetching public album:', error);

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

export { getPublicAlbumRoute };
