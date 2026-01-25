import { db } from "@polotrip/db";
import { users } from "@polotrip/db/schema";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { updateVideoStatus } from "@/app/functions/update-video-status";
import { env } from "@/env";
import { NotFoundError, UnauthorizedError } from "@/http/errors";
import { emailService } from "@/services/email/resend-service";

const paramsSchema = z.object({
  id: z.string(),
});

const bodySchema = z.object({
  videoId: z.string(),
  status: z.enum(["pending", "processing", "success", "failed"]),
  videoUrl: z.string().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  narrationUrl: z.string().nullable().optional(),
  scriptText: z.string().nullable().optional(),
  durationSeconds: z.number().nullable().optional(),
  errorMessage: z.string().nullable().optional(),
});

type UpdateVideoStatusParams = z.infer<typeof paramsSchema>;
type UpdateVideoStatusBody = z.infer<typeof bodySchema>;

export const updateVideoStatusRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch<{
    Params: UpdateVideoStatusParams;
    Body: UpdateVideoStatusBody;
  }>(
    "/albums/:id/video/update-status",
    {
      schema: {
        params: paramsSchema,
        body: bodySchema,
        response: {
          200: z.object({
            success: z.boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization;
        const expectedSecret = env.VIDEO_WORKER_SECRET;

        if (!expectedSecret) {
          app.log.warn("VIDEO_WORKER_SECRET not configured");
          throw new UnauthorizedError("Service not configured");
        }

        if (!authHeader?.startsWith("Bearer ")) {
          throw new UnauthorizedError("Missing authorization header");
        }

        const token = authHeader?.substring(7);
        if (token !== expectedSecret) {
          throw new UnauthorizedError("Invalid worker secret");
        }

        const {
          videoId,
          status,
          videoUrl,
          thumbnailUrl,
          narrationUrl,
          scriptText,
          durationSeconds,
          errorMessage,
        } = request.body;

        const { video, album } = await updateVideoStatus({
          videoId,
          status,
          videoUrl,
          thumbnailUrl,
          narrationUrl,
          scriptText,
          durationSeconds,
          errorMessage,
        });

        if (!video) {
          throw new NotFoundError("Video not found");
        }

        if (status === "success" && album) {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, album.userId))
            .limit(1);

          if (user?.email) {
            try {
              await emailService.sendVideoReadyEmail(
                user.name || "User",
                user.email,
                album.title,
                video.videoUrl || ""
              );
            } catch (emailError) {
              app.log.error(
                { err: emailError },
                "Failed to send video ready email"
              );
            }
          }
        }

        return reply.status(200).send({ success: true });
      } catch (error) {
        if (
          error instanceof UnauthorizedError ||
          error instanceof NotFoundError
        ) {
          throw error;
        }
        app.log.error({ err: error }, "Error when updating video status:");
        reply.status(500).send({ error: "Failed to process the request." });
      }
    }
  );
};
