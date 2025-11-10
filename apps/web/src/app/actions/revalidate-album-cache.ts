"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateAlbumCache(albumId: string, locale: string) {
  revalidateTag("albums-list");
  revalidateTag(`album-${albumId}`);
  revalidateTag(`album-${albumId}-locations`);
  revalidateTag(`album-${albumId}-photos`);

  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/album/${albumId}`);
}
