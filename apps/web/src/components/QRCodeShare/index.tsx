'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeShareProps } from './types';

export function QRCodeShare({ url, size = 200 }: QRCodeShareProps) {
  const handleDownload = () => {
    try {
      const canvas = document.createElement('canvas');
      const svg = document.querySelector(
        'svg[aria-label="QR Code para compartilhar o álbum Polotrip"]',
      );
      const ctx = canvas.getContext('2d');

      if (!svg || !ctx) return;

      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'polotrip-qrcode.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = url;
    } catch (error) {
      console.error(error);
      toast.error('Erro ao baixar QR Code');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary"
        tabIndex={0}
        aria-label="QR Code para compartilhar o álbum Polotrip"
        role="img"
        style={{ outline: 'none' }}
      >
        <QRCodeSVG
          value={url}
          size={size}
          level="H"
          includeMargin
          imageSettings={{
            src: '/brand/favicon.ico',
            height: 40,
            width: 40,
            excavate: true,
          }}
          aria-label="QR Code para compartilhar o álbum Polotrip"
          bgColor="#fff"
          fgColor="#22223b"
        />
        <span className="sr-only">
          QR Code para compartilhar o álbum Polotrip. Escaneie para acessar o link: {url}
        </span>
      </div>

      <Button
        variant="outline"
        onClick={handleDownload}
        className="flex items-center gap-2 hover:bg-secondary/50"
        aria-label="Baixar QR Code"
      >
        <Download className="h-4 w-4" />
        Baixar QR Code
      </Button>
    </div>
  );
}
