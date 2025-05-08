'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { EditAlbumModal } from '../EditAlbumModal';
import { useAlbumDetails } from '@/hooks/network/queries/useAlbumDetails';
import { useParams } from 'next/navigation';

export function AlbumDetailsCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const { data: album, isLoading } = useAlbumDetails(id as string);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!album) {
    return <div>Álbum não encontrado</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Detalhes do Álbum</h2>
            <p className="text-sm text-gray-500">Gerencie as informações básicas do seu álbum</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Editar Álbum"
            aria-labelledby="Editar Álbum"
            type="button"
            className="flex items-center gap-2 mt-2 text-primary font-bold hover:text-primary/80 transition-colors"
          >
            <Pencil size={16} />
            Editar Álbum
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Título</h3>
            <p className="mt-1">{album?.title}</p>
          </div>

          {album?.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
              <p className="mt-1">{album?.description}</p>
            </div>
          )}

          {album?.coverImageUrl && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Imagem de Capa</h3>
              <img
                src={album?.coverImageUrl}
                alt="Capa do álbum"
                className="mt-2 rounded-lg w-32 h-32 object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <EditAlbumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        albumId={album.id}
        initialData={album}
      />
    </>
  );
}
