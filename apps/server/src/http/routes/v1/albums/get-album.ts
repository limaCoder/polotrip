import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { getAlbumById } from "@/app/functions/get-album-by-id";
import { UnauthorizedError } from "@/http/errors";
import { authenticate } from "@/http/middlewares/authenticate";

const getAlbumRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/albums/:id",
    {
      onRequest: [authenticate],
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
              photoLimit: z.number(),
              plan: z.string(),
            }),
            user: z.object({
              name: z.string(),
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

        const { id } = request.params as { id: string };

        const result = await getAlbumById({ id });

        return result;
      } catch (error) {
        app.log.error("Error when fetching album:", error);

        if (error instanceof Error && error.message === "Album not found") {
          return reply.status(404).send({ error: "Album not found" });
        }

        return reply
          .status(500)
          .send({ error: "Failed to process the request." });
      }
    }
  );
};

export { getAlbumRoute };
