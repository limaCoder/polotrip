'use client';

import { useCallback, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Check, Loader } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUpdateAlbumDetails } from '@/hooks/network/mutations/useUpdateAlbumDetails';
import { EditAlbumModalProps, EditAlbumFormValues } from './types';
import { cn } from '@/lib/cn';
import { updateAlbumCover } from '@/actions/updateAlbumCover';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export function EditAlbumModal({ isOpen, onClose, albumId, initialData }: EditAlbumModalProps) {
  const { mutate: updateAlbum, isPending: isUpdating } = useUpdateAlbumDetails();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit } = useForm<EditAlbumFormValues>({
    defaultValues: {
      title: initialData?.title,
      description: initialData?.description || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageError(null);

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setImageError('O arquivo deve ter no máximo 5MB');
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setImageError('Formato de arquivo não suportado. Use PNG ou JPG');
        return;
      }

      setSelectedImage(file);
    }
  };

  const onSubmit = useCallback(
    async (data: EditAlbumFormValues) => {
      if (imageError) {
        return;
      }

      try {
        let coverImageUrl = initialData?.coverImageUrl;

        if (selectedImage) {
          startTransition(async () => {
            const formData = new FormData();
            formData.append('file', selectedImage);
            formData.append('albumId', albumId);
            if (initialData?.coverImageUrl) {
              formData.append('currentCoverUrl', initialData?.coverImageUrl);
            }

            const result = await updateAlbumCover(null, formData);

            if (result?.error) {
              toast.error(result?.error);
              return;
            }

            coverImageUrl = result?.coverImageUrl;

            updateAlbum(
              {
                albumId,
                title: data?.title || undefined,
                description: data?.description || null,
                coverImageUrl,
              },
              {
                onSuccess: () => {
                  onClose();
                  setSelectedImage(null);
                  setImageError(null);
                },
              },
            );
          });

          return;
        }

        updateAlbum(
          {
            albumId,
            title: data?.title || undefined,
            description: data?.description || null,
            coverImageUrl,
          },
          {
            onSuccess: () => {
              onClose();
              setSelectedImage(null);
              setImageError(null);
            },
          },
        );
      } catch (error) {
        console.error(error);
        toast.error('Erro ao atualizar o álbum. Tente novamente.');
      }
    },
    [albumId, updateAlbum, onClose, selectedImage, initialData?.coverImageUrl, imageError],
  );

  const isLoading = isPending || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Editar álbum</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu álbum. Deixe os campos em branco para manter os valores
            atuais.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register('title')} placeholder="Digite o título do álbum" />
          </div>

          <div>
            <Textarea
              {...register('description')}
              placeholder="Digite uma descrição para o álbum"
            />
          </div>

          <div>
            <div
              className={cn(
                'border border-dashed rounded p-3 h-[116px] flex flex-col items-center justify-center text-center relative',
                selectedImage ? 'border-primary' : 'border-text/25',
                imageError && 'border-red-500',
              )}
            >
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleImageChange}
                disabled={isLoading}
              />
              {isLoading ? (
                <>
                  <Loader size={24} className="text-primary mb-2 animate-spin" />
                  <p className="font-body_two text-sm">
                    <span className="text-primary font-bold">
                      {isPending ? 'Enviando imagem...' : 'Atualizando álbum...'}
                    </span>
                  </p>
                </>
              ) : selectedImage ? (
                <>
                  <Check size={24} className="text-primary mb-2" />
                  <p className="font-body_two text-sm">
                    <span className="text-primary font-bold">Imagem selecionada!</span>
                    <br />
                    Se deseja alterar, arraste e solte novamente
                  </p>
                  <span className="text-primary text-xs mt-1">{selectedImage?.name}</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-text/25 mb-2" />
                  <p className="font-body_two text-sm">
                    <span className="text-primary font-bold">Faça upload de uma foto</span>
                    <br />
                    ou arraste e solte
                  </p>
                  <span className="text-primary text-xs mt-1">PNG, JPG até 5MB</span>
                </>
              )}
            </div>
            {imageError && <p className="mt-2 text-sm text-red-500">{imageError}</p>}
            <div className="mt-2 p-3 bg-secondary/5 rounded-lg">
              <p className="text-sm font-body_two mb-2">✨ Recomendações para uma capa incrível:</p>
              <div className="flex items-center gap-3">
                <div className="w-[120px] h-[68px] bg-secondary/20 rounded flex items-center justify-center border border-dashed border-primary/30">
                  <span className="text-[10px] text-primary/70">1600 x 900 px</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text/70">• Use uma imagem no formato horizontal</p>
                  <p className="text-sm text-text/70">• Resolução recomendada: 1600 x 900 pixels</p>
                  <p className="text-sm text-text/70">• Evite textos na imagem</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              className="hover:bg-secondary/40 transition-colors"
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !!imageError}
              className="bg-primary text-white"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
