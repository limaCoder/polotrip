'use client';

import { toast } from 'sonner';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareButtonsProps } from './types';
import { useTranslations } from 'next-intl';

export function ShareButtons({ url, title, description, ownerName }: ShareButtonsProps) {
  const t = useTranslations('PublicAlbum.ShareModal');
  const urlWithShareFlag = `${url}?share=true`;

  const shareText = description
    ? t('share_text_with_description', { title, description, ownerName })
    : t('share_text_without_description', { title, ownerName });

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

        toast.error(t('share_error'));
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success(t('link_copied_toast'));
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
          <Image src="/icons/whatsapp.svg" alt={t('whatsapp_icon_alt')} width={24} height={24} />
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
            toast.success(t('link_copied_toast'));
          }}
        >
          {t('copy_button')}
        </Button>
      </div>
    </div>
  );
}
