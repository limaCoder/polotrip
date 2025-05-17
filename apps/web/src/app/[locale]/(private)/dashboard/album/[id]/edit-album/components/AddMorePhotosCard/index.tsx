import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

import { useCheckAlbumSpace } from '@/hooks/network/queries/useCheckAlbumSpace';
import { Button } from '@/components/ui/button';

export function AddMorePhotosCard() {
  const { id: albumId, locale } = useParams<{ id: string; locale: string }>();
  const router = useRouter();

  const { data: albumSpace, isLoading } = useCheckAlbumSpace({
    albumId,
  });

  const handleAddMorePhotos = () => {
    if (!albumSpace?.canUpload) {
      toast.error('Limite excedido', {
        description: 'Você já atingiu o limite de fotos para este álbum.',
        duration: 5000,
        richColors: true,
      });
      return;
    }

    router.push(`/${locale}/dashboard/album/${albumId}/upload`);
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return 'Verificando espaço disponível...';
    }

    if (!albumSpace?.canUpload) {
      return 'Você atingiu o limite de fotos para este álbum.';
    }

    const photoText = albumSpace.availableSpace === 1 ? 'foto' : 'fotos';
    return `Você ainda pode adicionar ${albumSpace.availableSpace} ${photoText} neste álbum.`;
  };

  return (
    <div className="bg-background p-8 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <Upload size={24} className="text-primary" />
        <h2 className="font-title_three font-bold">Adicionar mais fotos</h2>
      </div>

      <p className="font-body_two text-text/75 mb-6">{getStatusMessage()}</p>

      <Button
        onClick={handleAddMorePhotos}
        disabled={isLoading || !albumSpace?.canUpload}
        className="bg-primary text-background rounded px-8 py-3 hover:bg-primary/90 font-body_two flex items-center gap-2 w-full justify-center"
        aria-label="Adicionar mais fotos ao álbum"
      >
        <Upload size={16} />
        <span>Adicionar mais fotos</span>
      </Button>
    </div>
  );
}
