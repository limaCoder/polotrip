import { fromNodeHeaders } from "better-auth/node";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { checkAlbumSpace } from "@/app/functions/check-album-space";
import { UnauthorizedError } from "@/http/errors";
import { authenticate } from "@/http/middlewares/authenticate";

const paramsSchema = z.object({
  albumId: z.string(),
});

type CheckAlbumSpaceParams = z.infer<typeof paramsSchema>;

export async function checkAlbumSpaceRoutes(app: FastifyInstance) {
  app.get<{
    Params: CheckAlbumSpaceParams;
  }>(
    "/albums/:albumId/check-space",
    {
      onRequest: [authenticate],
      schema: {
        params: paramsSchema,
        response: {
          200: z.object({
            availableSpace: z.number(),
            totalSpace: z.number(),
            usedSpace: z.number(),
            canUpload: z.boolean(),
          }),
          404: z.object({
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
        const { albumId } = request.params;

        try {
          const result = await checkAlbumSpace({
            albumId,
            userId,
          });

          return reply.status(200).send(result);
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === "Album not found") {
              return reply.status(404).send({ message: error.message });
            }

            if (error.message === "Album does not belong to user") {
              return reply.status(403).send({ message: error.message });
            }
          }

          throw error;
        }
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(400).send({ error: error.message });
        }
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
}
