import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export async function uploadImage(file: File): Promise<string> {
  if (!file) {
    return '';
  }

  try {
    const fileExtension = file?.name?.split('.').pop();
    const fileName = `cover_${uuidv4()}.${fileExtension}`;

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

    const buffer = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from('polotrip-albums-covers')
      .upload(fileName, buffer, {
        contentType: file.type,
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
