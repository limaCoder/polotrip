import { createId } from "@paralleldrive/cuid2";
import { db } from "@polotrip/db";
import { albums } from "@polotrip/db/schema";

import { type AlbumPlan, PHOTO_LIMITS } from "@/app/constants/pricingEnum";

type CreateAlbumRequest = {
  userId: string;
  title: string;
  date: string;
  description?: string | null;
  coverImageUrl?: string | null;
  plan: AlbumPlan;
};

async function createAlbum({
  userId,
  title,
  date,
  description,
  coverImageUrl,
  plan,
}: CreateAlbumRequest) {
  const shareableLink = `album=${createId()}`;
  const photoLimit = PHOTO_LIMITS[plan];

  const [originalAlbum] = await db
    .insert(albums)
    .values({
      userId,
      title,
      date,
      description,
      coverImageUrl,
      shareableLink,
      isPublished: false,
      isPaid: false,
      plan,
      photoLimit,
    })
    .returning();

  const { userId: removedUserId, ...album } = originalAlbum;

  return { album };
}

export { createAlbum };
