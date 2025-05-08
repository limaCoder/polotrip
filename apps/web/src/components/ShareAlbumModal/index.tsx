'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareAlbumModalProps } from './types';
import { ShareButtons } from '@/components/ShareButtons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeShare } from '@/components/QRCodeShare';

export function ShareAlbumModal({
  isOpen,
  onClose,
  albumId,
  albumTitle,
  albumDescription,
}: ShareAlbumModalProps) {
  const shareUrl = `${window.location.origin}/album/${albumId}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar álbum</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="data-[state=active]:bg-secondary" value="links">
              Links
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-secondary" value="qrcode">
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <ShareButtons url={shareUrl} title={albumTitle} description={albumDescription} />
          </TabsContent>

          <TabsContent value="qrcode">
            <QRCodeShare url={shareUrl} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
