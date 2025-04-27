import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import sharp from 'sharp';

export async function uploadImage(file: File): Promise<string> {
  if (!file) {
    return '';
  }

  try {
    const fileExtension = file.name?.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `cover_${uuidv4()}.${fileExtension}`;
    const mimeType = file.type || `image/${fileExtension}`;

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const compressedBuffer = await sharp(inputBuffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    const { error } = await supabase.storage
      .from('polotrip-albums-covers')
      .upload(fileName, compressedBuffer, {
        contentType: mimeType,
        cacheControl: '3600',
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('polotrip-albums-covers').getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to process image upload');
  }
}
