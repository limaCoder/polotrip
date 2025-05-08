'use server';

import { updateCoverImage } from './utils/update-cover-image';

interface UpdateAlbumCoverState {
  error?: string;
  success?: boolean;
  coverImageUrl?: string;
}

export async function updateAlbumCover(
  prevState: UpdateAlbumCoverState | null,
  formData: FormData,
) {
  try {
    const file = formData.get('file') as File;
    const albumId = formData.get('albumId') as string;
    const currentCoverUrl = formData.get('currentCoverUrl') as string;

    if (!file || !albumId) {
      return {
        error: 'Arquivo ou ID do álbum não fornecido',
      };
    }

    const publicUrl = await updateCoverImage(file, albumId, currentCoverUrl || null);

    return {
      success: true,
      coverImageUrl: publicUrl,
    };
  } catch (error) {
    console.error('Error updating album cover:', error);
    return {
      error: error instanceof Error ? error.message : 'Erro ao atualizar a capa do álbum',
    };
  }
}
