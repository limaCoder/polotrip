'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/Button';

export function UploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0.0 MB';
    const megabytes = bytes / (1024 * 1024);
    return `${megabytes.toFixed(1)} MB`;
  };

  return (
    <div className="bg-background p-8 rounded-lg shadow-md">
      <h1 className="font-title_three font-bold mb-6">Upload de Fotos</h1>

      <div
        className={`border border-dashed border-text/25 rounded-md p-3 h-[116px] flex flex-col items-center justify-center text-center relative mb-6`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/jpg"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        <Upload size={24} className="text-text/25 mb-2" />
        <p className="font-body_two text-sm">
          <span className="text-primary font-bold">Faça upload de uma foto</span>
          <br />
          ou arraste e solte
        </p>
        <span className="text-primary text-xs mt-1">Aceita imagens JPG e PNG</span>
      </div>

      <>
        <div className="flex justify-between items-center mb-6">
          <span className="font-body_two">1 foto selecionada</span>
          <span className="font-body_two">{formatFileSize(0)}</span>
        </div>

        <div className="relative rounded overflow-hidden mb-6 w-full h-[200px] group">
          <Image
            src="/pages/upload/photo_sample.jpg"
            alt="Preview"
            width={184}
            height={112}
            className="object-cover rounded-xs"
          />
          <button
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      </>

      <div className="w-full flex justify-end gap-4">
        <Button className="font-bold border border-text-opacity-25 rounded px-4 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Limpar tudo
        </Button>

        <Button className="font-bold border border-text-opacity-25 bg-primary text-background rounded px-4 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
          Continuar
        </Button>
      </div>
    </div>
  );
}
