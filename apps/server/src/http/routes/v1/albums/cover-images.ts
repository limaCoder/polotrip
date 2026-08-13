import { createId } from "@paralleldrive/cuid2";
import { db } from "@polotrip/db";
import { albums } from "@polotrip/db/schema";
import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { StorageProviderFactory } from "@/app/factories/storage-provider.factory";
import { UnauthorizedError } from "@/http/errors";
import { authenticate } from "@/http/middlewares/authenticate";
import {
  getR2ObjectPath,
  getR2PublicUrl,
  R2_CONTENT_BUCKET,
} from "@/services/storage/r2-config";

const bodySchema = z.object({
  albumId: z.string().nullable().optional(),
  currentCoverUrl: z.string().url().nullable().optional(),
  contentType: z.string().regex(/^image\/(jpeg|jpg|png)$/),
  data: z.string().min(1),
});

export const coverImagesRoute: FastifyPluginAsyncZod = async (app) => {
  app.post<{ Body: z.infer<typeof bodySchema> }>(
    "/albums/cover-images",
    {
      onRequest: [authenticate],
      schema: {
        body: bodySchema,
        response: {
          200: z.object({ coverImageUrl: z.string().url() }),
          403: z.object({ error: z.string() }),
          404: z.object({ error: z.string() }),
          413: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const session = await request.server.auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session) throw new UnauthorizedError();

      const { albumId, currentCoverUrl, contentType, data } = request.body;

      if (albumId) {
        const album = await db
          .select({ userId: albums.userId })
          .from(albums)
          .where(eq(albums.id, albumId))
          .then((rows) => rows[0]);

        if (!album) return reply.status(404).send({ error: "Album not found" });
        if (album.userId !== session.user.id) {
          return reply
            .status(403)
            .send({ error: "Album does not belong to user" });
        }
      }

      const extension = contentType === "image/png" ? "png" : "jpg";
      const objectPath = `covers/${albumId ? `cover_${albumId}` : `cover_${createId()}`}.${extension}`;
      const image = Buffer.from(data, "base64");

      if (image.byteLength > 5 * 1024 * 1024) {
        return reply.status(413).send({ error: "Cover image is too large" });
      }

      await StorageProviderFactory.getProvider().putObject(
        R2_CONTENT_BUCKET,
        objectPath,
        image,
        contentType
      );

      const oldObjectPath = currentCoverUrl
        ? getR2ObjectPath(currentCoverUrl)
        : null;
      if (oldObjectPath && oldObjectPath !== objectPath) {
        await StorageProviderFactory.getProvider().deleteObjects(
          R2_CONTENT_BUCKET,
          [oldObjectPath]
        );
      }

      return { coverImageUrl: getR2PublicUrl(objectPath) };
    }
  );
};
