import { db } from "@polotrip/db";
import { albums } from "@polotrip/db/schema";
import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createVideoJob } from "@/app/functions/create-video-job";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/http/errors";
import { authenticate } from "@/http/middlewares/authenticate";

const paramsSchema = z.object({
  id: z.string(),
});

const bodySchema = z.object({
  style: z.enum(["emotional", "documentary", "fun"]).default("emotional"),
});

type CreateVideoParams = z.infer<typeof paramsSchema>;
type CreateVideoBody = z.infer<typeof bodySchema>;

export const createVideoRoute: FastifyPluginAsyncZod = async (app) => {
  app.post<{
    Params: CreateVideoParams;
    Body: CreateVideoBody;
  }>(
    "/albums/:id/video/create",
    {
      onRequest: [authenticate],
      schema: {
        params: paramsSchema,
        body: bodySchema,
        response: {
          201: z.object({
            video: z.object({
              id: z.string(),
              albumId: z.string(),
              status: z.enum(["pending", "processing", "success", "failed"]),
              style: z.enum(["emotional", "documentary", "fun"]),
              createdAt: z.date(),
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

        const { id: albumId } = request.params;
        const { style } = request.body;

        const [album] = await db
          .select()
          .from(albums)
          .where(eq(albums.id, albumId))
          .limit(1);

        if (!album) {
          throw new NotFoundError("Album not found");
        }

        if (album.userId !== session.user.id) {
          throw new UnauthorizedError("You don't have access to this album");
        }

        if (!album.isPaid) {
          throw new BadRequestError(
            "Album must be paid before generating video"
          );
        }

        if (album.photoCount < 5) {
          throw new BadRequestError(
            "Album must have at least 5 photos to generate a video"
          );
        }

        const { video } = await createVideoJob({
          albumId,
          style,
        });

        return reply.status(201).send({
          video: {
            id: video.id,
            albumId: video.albumId,
            status: video.status,
            style: video.style,
            createdAt: video.createdAt,
          },
        });
      } catch (error) {
        if (
          error instanceof UnauthorizedError ||
          error instanceof NotFoundError ||
          error instanceof BadRequestError
        ) {
          throw error;
        }
        app.log.error({ err: error }, "Error when creating video job:");
        reply.status(500).send({ error: "Failed to process the request." });
      }
    }
  );
};
