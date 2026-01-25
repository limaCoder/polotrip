import { db } from "@polotrip/db";
import type { VideoStyle } from "@polotrip/db/models";
import { albumVideos } from "@polotrip/db/schema";
import { eq } from "drizzle-orm";

import { env } from "@/env";
import { rabbitmqService } from "@/services/queue/rabbitmq-service";

type CreateVideoJobRequest = {
  albumId: string;
  style: VideoStyle;
};

async function createVideoJob({ albumId, style }: CreateVideoJobRequest) {
  const [video] = await db
    .insert(albumVideos)
    .values({
      albumId,
      style,
      status: "pending",
    })
    .returning();

  const callbackUrl = `${env.WEB_URL}/api/v1/albums/${albumId}/video/update-status`;

  const jobPublished = await rabbitmqService.publishVideoJob({
    albumId,
    videoId: video.id,
    style,
    callbackUrl,
  });

  if (jobPublished) {
    await db
      .update(albumVideos)
      .set({
        queueJobId: video.id,
        updatedAt: new Date(),
      })
      .where(eq(albumVideos.id, video.id));
  }

  return { video };
}

export { createVideoJob };
