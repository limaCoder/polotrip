import { db } from "@polotrip/db";
import { albums } from "@polotrip/db/schema";
import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getVideoByAlbumId } from "@/app/functions/get-video-by-album-id";
import { NotFoundError, UnauthorizedError } from "@/http/errors";
import { authenticate } from "@/http/middlewares/authenticate";

const paramsSchema = z.object({
  id: z.string(),
});

type GetVideoParams = z.infer<typeof paramsSchema>;

export const getVideoRoute: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Params: GetVideoParams;
  }>(
    "/albums/:id/video",
    {
      onRequest: [authenticate],
      schema: {
        params: paramsSchema,
        response: {
          200: z.object({
            video: z
              .object({
                id: z.string(),
                albumId: z.string(),
                status: z.enum(["pending", "processing", "success", "failed"]),
                style: z.enum(["emotional", "documentary", "fun"]),
                videoUrl: z.string().nullable(),
                thumbnailUrl: z.string().nullable(),
                durationSeconds: z.number().nullable(),
                scriptText: z.string().nullable(),
                narrationUrl: z.string().nullable(),
                errorMessage: z.string().nullable(),
                retryCount: z.number(),
                createdAt: z.date(),
                updatedAt: z.date(),
                startedAt: z.date().nullable(),
                completedAt: z.date().nullable(),
              })
              .nullable(),
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

        const { video } = await getVideoByAlbumId({ albumId });

        return reply.status(200).send({ video });
      } catch (error) {
        if (
          error instanceof UnauthorizedError ||
          error instanceof NotFoundError
        ) {
          throw error;
        }
        app.log.error({ err: error }, "Error when getting video:");
        reply.status(500).send({ error: "Failed to process the request." });
      }
    }
  );
};
