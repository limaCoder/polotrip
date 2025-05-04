'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InstallPwaModalProps } from './types';
import { ExternalLink } from 'lucide-react';

export function InstallPwaModal({ isOpen, onClose }: InstallPwaModalProps) {
  const handleOpenInstallGuide = () => {
    window.open('https://www.installpwa.com/from/polotrip.com', '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="px-2 w-[90%] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Instale o aplicativo Polotrip</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-muted-foreground">
          Para uma experiência melhor, instale o Polotrip como um aplicativo no seu dispositivo e
          tenha acesso rápido às suas memórias de viagem, mesmo offline!
        </DialogDescription>
        <DialogFooter>
          <div className="flex w-full justify-evenly">
            <Button variant="outline" onClick={onClose} aria-label="Talvez depois">
              Talvez depois
            </Button>

            <Button
              className="text-white flex items-center gap-2"
              onClick={handleOpenInstallGuide}
              aria-label="Instalar agora"
            >
              Instalar agora
              <ExternalLink size={16} />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
