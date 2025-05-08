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
  albumOwnerName,
}: ShareAlbumModalProps) {
  const shareUrl = `${window.location.origin}/album/${albumId}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="px-2 w-[90%] overflow-hidden">
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
