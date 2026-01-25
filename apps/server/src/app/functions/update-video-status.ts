import { db } from "@polotrip/db";
import type { VideoStatus } from "@polotrip/db/models";
import { albumVideos, albums } from "@polotrip/db/schema";
import { eq } from "drizzle-orm";

type UpdateVideoStatusRequest = {
  videoId: string;
  status: VideoStatus;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  narrationUrl?: string | null;
  scriptText?: string | null;
  durationSeconds?: number | null;
  errorMessage?: string | null;
};

async function updateVideoStatus({
  videoId,
  status,
  videoUrl,
  thumbnailUrl,
  narrationUrl,
  scriptText,
  durationSeconds,
  errorMessage,
}: UpdateVideoStatusRequest) {
  const now = new Date();

  const updateData: Record<string, unknown> = {
    status,
    updatedAt: now,
  };

  if (status === "processing") {
    updateData.startedAt = now;
  }

  if (status === "success" || status === "failed") {
    updateData.completedAt = now;
  }

  if (videoUrl !== undefined) {
    updateData.videoUrl = videoUrl;
  }

  if (thumbnailUrl !== undefined) {
    updateData.thumbnailUrl = thumbnailUrl;
  }

  if (narrationUrl !== undefined) {
    updateData.narrationUrl = narrationUrl;
  }

  if (scriptText !== undefined) {
    updateData.scriptText = scriptText;
  }

  if (durationSeconds !== undefined) {
    updateData.durationSeconds = durationSeconds;
  }

  if (errorMessage !== undefined) {
    updateData.errorMessage = errorMessage;
  }

  const [video] = await db
    .update(albumVideos)
    .set(updateData)
    .where(eq(albumVideos.id, videoId))
    .returning();

  if (!video) {
    return { video: null, album: null };
  }

  const [album] = await db
    .select()
    .from(albums)
    .where(eq(albums.id, video.albumId))
    .limit(1);

  return { video, album: album || null };
}

export { updateVideoStatus };
