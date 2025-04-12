import { createClient } from '@supabase/supabase-js';
import { createId } from '@paralleldrive/cuid2';
import { env } from '@/env';
import { eq } from 'drizzle-orm';
import { db } from '@polotrip/db';
import { albums } from '@polotrip/db/schema';

interface GetUploadUrlsRequest {
  albumId: string;
  userId: string;
  fileNames: string[];
  fileTypes: string[];
}

async function getUploadUrls({ albumId, userId, fileNames, fileTypes }: GetUploadUrlsRequest) {
  if (fileNames.length !== fileTypes.length) {
    throw new Error('Name and file type quantity does not match');
  }

  const album = await db
    .select()
    .from(albums)
    .where(eq(albums.id, albumId))
    .then(rows => rows[0]);

  if (!album) {
    throw new Error('Album not found');
  }

  if (album.userId !== userId) {
    throw new Error('Album does not belong to user');
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

  const urls = [];

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const fileExtension = fileName.split('.').pop() || 'jpg';
    const uniqueFilename = `${createId()}.${fileExtension}`;
    const filePath = `${userId}/${albumId}/${uniqueFilename}`;

    const { data, error } = await supabase.storage
      .from('polotrip-albums-content')
      .createSignedUploadUrl(filePath);

    if (error) {
      throw error;
    }

    urls.push({
      signedUrl: data.signedUrl,
      filePath: data.path,
      fileName,
    });
  }

  return { urls };
}

export { getUploadUrls };
