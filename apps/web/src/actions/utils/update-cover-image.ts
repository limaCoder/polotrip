import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import sharp from 'sharp';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export async function updateCoverImage(
  file: File,
  albumId: string,
  currentCoverUrl?: string | null,
): Promise<string> {
  if (!file) {
    throw new Error('Nenhum arquivo foi fornecido');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('O arquivo deve ter no máximo 5MB');
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Formato de arquivo não suportado. Use PNG ou JPG');
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    const fileExtension = file.name?.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `cover_${albumId}.${fileExtension}`;
    const mimeType = file.type || `image/${fileExtension}`;

    if (currentCoverUrl) {
      const currentFileName = currentCoverUrl.split('/').pop();
      if (currentFileName) {
        const { error: removeError } = await supabase.storage
          .from('polotrip-albums-covers')
          .remove([currentFileName]);

        if (removeError) {
          console.error('Error removing old cover:', removeError);
        }
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const compressedBuffer = await sharp(inputBuffer)
      .resize(1600, 900, {
        fit: 'cover',
        position: 'centre',
      })
      .toBuffer();

    const { error } = await supabase.storage
      .from('polotrip-albums-covers')
      .upload(fileName, compressedBuffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('polotrip-albums-covers').getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error updating cover image:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Erro ao processar o upload da imagem');
  }
}
