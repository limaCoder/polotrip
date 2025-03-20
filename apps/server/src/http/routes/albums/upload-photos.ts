import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import fastifyMultipart from '@fastify/multipart';

import { eq, sql } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { photos } from '@polotrip/db/schema';

import { uploadPhotos } from '@/app/functions/upload-photos';
import { authenticate } from '@/http/middlewares/authenticate';

const querySchema = z.object({
  albumId: z.string(),
  userId: z.string(),
});

type UploadPhotosQuery = z.infer<typeof querySchema>;

export const uploadPhotosRoute: FastifyPluginAsyncZod = async app => {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 100,
    },
  });

  app.post<{
    Querystring: UploadPhotosQuery;
  }>(
    '/albums/photos/upload',
    {
      onRequest: [authenticate],
      schema: {
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
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { albumId, userId } = request.query;

        const filesIterator = await request.files();
        const files = [];

        for await (const file of filesIterator) {
          files.push(file);
        }

        if (files.length === 0) {
          return reply.status(400).send({
            message: 'No photo sent',
          });
        }

        const currentPhotos = await db
          .select({ count: sql`count(*)` })
          .from(photos)
          .where(eq(photos.albumId, albumId))
          .then(rows => Number(rows[0]?.count || 0));

        if (currentPhotos + files.length > 300) {
          return reply.status(400).send({
            message: 'Limit of 300 photos per album exceeded',
          });
        }

        const { photos: uploadedPhotos } = await uploadPhotos({
          albumId,
          userId,
          files,
        });

        return { photos: uploadedPhotos };
      } catch (error) {
        console.error('Error when make photos upload:', error);

        return reply.status(400).send({
          message: error instanceof Error ? error.message : 'Error when processing upload',
        });
      }
    },
  );
};
