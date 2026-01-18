import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getAlbumDates } from "@/app/functions/get-album-dates";
import { UnauthorizedError } from "@/http/errors";
import { authenticate } from "@/http/middlewares/authenticate";

const paramsSchema = z.object({
  albumId: z.string(),
});

type GetAlbumDatesParams = z.infer<typeof paramsSchema>;

export const getAlbumDatesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get<{
    Params: GetAlbumDatesParams;
  }>(
    "/albums/:albumId/dates",
    {
      onRequest: [authenticate],
      schema: {
        params: paramsSchema,
        response: {
          200: z.object({
            dates: z.array(
              z.object({
                date: z.string().nullable(),
                count: z.number(),
              })
            ),
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
          const result = await getAlbumDates({
            albumId,
            userId,
          });

          return result;
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
        app.log.error({ err: error }, "Error fetching album dates:");
        reply.status(500).send({ error: "Failed to fetch album dates" });
      }
    }
  );
};
