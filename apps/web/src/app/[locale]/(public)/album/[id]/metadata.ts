import { getPublicAlbum } from '@/http/get-public-album';
import { Metadata } from 'next';
import { AlbumViewPageProps } from './types';

export async function generateAlbumMetadata({ params }: AlbumViewPageProps): Promise<Metadata> {
  const { id: albumId } = await params;
  const albumData = await getPublicAlbum({ albumId }).catch(() => null);

  if (!albumData) {
    return {
      title: 'Álbum não encontrado | Polotrip',
    };
  }

  return {
    title: `${albumData?.album?.title} | Polotrip`,
    description:
      albumData?.album?.description ||
      'Confira as fotos e memórias deste álbum especial no Polotrip',
    openGraph: {
      title: `${albumData?.album?.title} | Polotrip`,
      description:
        albumData?.album?.description ||
        'Confira as fotos e memórias deste álbum especial no Polotrip',
      type: 'article',
      images: [
        {
          url: albumData?.album?.coverImageUrl || 'https://polotrip.com/openGraph/og-image.jpg',
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
