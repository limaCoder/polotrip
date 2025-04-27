import z from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getPublicAlbumLocations } from '@/app/functions/get-public-album-locations';

const getPublicAlbumLocationsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/public/albums/:id/locations',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            locations: z.array(
              z.object({
                id: z.string(),
                latitude: z.number().nullable(),
                longitude: z.number().nullable(),
                locationName: z.string().nullable(),
                dateTaken: z.string().nullable(),
                imageUrl: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const result = await getPublicAlbumLocations({ albumId: id });

        return result;
      } catch (error) {
        app.log.error('Error when fetching public album locations:', error);

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

export { getPublicAlbumLocationsRoute };
