import { db } from "@polotrip/db";
import { albumVideos } from "@polotrip/db/schema";
import { desc, eq } from "drizzle-orm";

type GetVideoByAlbumIdRequest = {
  albumId: string;
};

async function getVideoByAlbumId({ albumId }: GetVideoByAlbumIdRequest) {
  const [video] = await db
    .select()
    .from(albumVideos)
    .where(eq(albumVideos.albumId, albumId))
    .orderBy(desc(albumVideos.createdAt))
    .limit(1);

  return { video: video || null };
}

export { getVideoByAlbumId };
