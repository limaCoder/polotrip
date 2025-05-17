'use client';

import { toast } from 'sonner';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareButtonsProps } from './types';

export function ShareButtons({ url, title, description, ownerName }: ShareButtonsProps) {
  const urlWithShareFlag = `${url}?share=true`;

  const shareText = description
    ? `${title} - ${description}\n\nÁlbum de ${ownerName} no Polotrip`
    : `Confira o álbum ${title} de ${ownerName} no Polotrip`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + urlWithShareFlag)}`,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Polotrip`,
          text: shareText,
          url: urlWithShareFlag,
        });
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }

        toast.error('Não foi possível compartilhar o conteúdo');
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(shareLinks.whatsapp, '_blank')}
          className="h-12 w-12 hover:bg-secondary/50"
        >
          <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          className="h-12 w-12 hover:bg-secondary/50"
        >
          <Share2 className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={urlWithShareFlag}
          readOnly
          className="flex-1 px-3 py-2 border rounded-md bg-background"
        />
        <Button
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(urlWithShareFlag);
            toast.success('Link copiado!');
          }}
        >
          Copiar
        </Button>
      </div>
    </div>
  );
}
