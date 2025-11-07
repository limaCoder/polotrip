import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";
import { updateAlbum } from "@/app/functions/update-album";
import { sanitizeNonNullable, sanitizeNullable } from "@/app/utils/sanitize";
import { UnauthorizedError } from "@/http/errors";
import { authenticate } from "@/http/middlewares/authenticate";

const paramsSchema = z.object({
  id: z.string(),
});

const bodySchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().max(1000).nullable().optional(),
  coverImageUrl: z
    .union([z.string().url(), z.string().length(0), z.null()])
    .optional(),
  musicUrl: z
    .string()
    .url()
    .refine(
      (url) =>
        url.includes("youtube.com") ||
        url.includes("youtu.be") ||
        url.includes(""),
      {
        message: "URL must be from YouTube",
      }
    )
    .nullable()
    .optional(),
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
      })
    )
    .optional(),
  currentStepAfterPayment: z.string().nullable().optional(),
});

type UpdateAlbumParams = z.infer<typeof paramsSchema>;
type UpdateAlbumBody = z.infer<typeof bodySchema>;

export const updateAlbumRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch<{
    Params: UpdateAlbumParams;
    Body: UpdateAlbumBody;
  }>(
    "/albums/:id",
    {
      onRequest: [authenticate],
      schema: {
        params: paramsSchema,
        body: bodySchema,
        response: {
          200: z.object({
            success: z.boolean(),
            album: z.object({
              id: z.string(),
              title: z.string(),
              description: z.string().nullable(),
              coverImageUrl: z.string().nullable(),
              musicUrl: z.string().nullable(),
              isPublished: z.boolean(),
              isPaid: z.boolean(),
              currentStepAfterPayment: z.string(),
              shareableLink: z.string(),
              photoCount: z.number(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
            message: z.string(),
          }),
          400: z.union([
            z.object({ message: z.string() }),
            z.object({ error: z.object({ message: z.string() }) }),
          ]),
          401: z.union([
            z.object({ message: z.string() }),
            z.object({ error: z.object({ message: z.string() }) }),
          ]),
          403: z.union([
            z.object({ message: z.string() }),
            z.object({ error: z.object({ message: z.string() }) }),
          ]),
          404: z.union([
            z.object({ message: z.string() }),
            z.object({ error: z.object({ message: z.string() }) }),
          ]),
          500: z.union([
            z.object({ message: z.string() }),
            z.object({ error: z.object({ message: z.string() }) }),
          ]),
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
          musicUrl,
          isPublished,
          photoUpdates,
          currentStepAfterPayment,
        } = request.body;

        const sanitizedInput = {
          albumId: DOMPurify.sanitize(albumId),
          title: sanitizeNonNullable(title),
          description: sanitizeNullable(description),
          coverImageUrl: sanitizeNullable(coverImageUrl),
          musicUrl: sanitizeNullable(musicUrl),
          isPublished,
          photoUpdates: photoUpdates ?? [],
          currentStepAfterPayment: sanitizeNonNullable(
            currentStepAfterPayment as string | undefined
          ),
        };

        const result = await updateAlbum({
          albumId: sanitizedInput.albumId,
          userId,
          title: sanitizedInput.title,
          description: sanitizedInput.description,
          coverImageUrl: sanitizedInput.coverImageUrl,
          musicUrl: sanitizedInput.musicUrl,
          isPublished: sanitizedInput.isPublished,
          photoUpdates: sanitizedInput.photoUpdates,
          currentStepAfterPayment: sanitizedInput.currentStepAfterPayment,
        });

        return result;
      } catch (error) {
        app.log.error("Error updating album:", error);

        return reply.status(500).send({
          success: false,
          message: "Failed to process the request.",
        });
      }
    }
  );
};
