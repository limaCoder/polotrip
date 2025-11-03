import { createId } from "@paralleldrive/cuid2";
import { db } from "@polotrip/db";
import { albums, photos } from "@polotrip/db/schema";
import { eq, sql } from "drizzle-orm";
import { StorageProviderFactory } from "../factories/storage-provider.factory";

type GetUploadUrlsRequest = {
  albumId: string;
  userId: string;
  fileNames: string[];
  fileTypes: string[];
};

async function getUploadUrls({
  albumId,
  userId,
  fileNames,
  fileTypes,
}: GetUploadUrlsRequest) {
  if (fileNames.length !== fileTypes.length) {
    throw new Error("Name and file type quantity does not match");
  }

  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .then((rows) => rows[0]);

  if (!album) {
    throw new Error("Album not found");
  }

  if (album.userId !== userId) {
    throw new Error("Album does not belong to user");
  }

  const currentPhotos = await db
    .select({ count: sql`count(*)` })
    .from(photos)
    .where(eq(photos.albumId, albumId))
    .then((rows) => Number(rows[0]?.count || 0));

  if (currentPhotos + fileNames.length > album.photoLimit) {
    throw new Error(`Limit of ${album.photoLimit} photos per album exceeded`);
  }

  const storageProvider = StorageProviderFactory.getProvider();

  // biome-ignore lint/suspicious/noEvolvingTypes: we need to use any type here
  const urls = [];

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const fileExtension = fileName.split(".").pop() || "jpg";
    const uniqueFilename = `${createId()}.${fileExtension}`;
    const filePath = `${userId}/${albumId}/${uniqueFilename}`;

    const data = await storageProvider.createSignedUploadUrl(
      "polotrip-albums-content",
      filePath
    );

    urls.push({
      signedUrl: data.signedUrl,
      filePath: data.path,
      fileName,
    });
  }

  return { urls };
}

export { getUploadUrls };
