'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareAlbumModalProps } from './types';
import { ShareButtons } from '@/components/ShareButtons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeShare } from '@/components/QRCodeShare';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function ShareAlbumModal({
  isOpen,
  onClose,
  albumId,
  albumTitle,
  albumDescription,
  albumOwnerName,
}: ShareAlbumModalProps) {
  const t = useTranslations('PublicAlbum.ShareModal');
  const { locale } = useParams();
  const shareUrl = `${window.location.origin}/${locale}/album/${albumId}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="px-2 w-[90%] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="data-[state=active]:bg-secondary" value="links">
              {t('links_tab')}
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-secondary" value="qrcode">
              {t('qrcode_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <ShareButtons
              url={shareUrl}
              title={albumTitle}
              description={albumDescription}
              ownerName={albumOwnerName}
            />
          </TabsContent>

          <TabsContent value="qrcode">
            <QRCodeShare url={shareUrl} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
