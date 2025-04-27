'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FinishEditDialogProps } from './types';

export function FinishEditDialog({ isOpen, onClose, onConfirm }: FinishEditDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finalizar edição do álbum?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="mb-2">
                Você está prestes a finalizar a edição do seu álbum. Isso significa que:
              </p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Todas as edições feitas serão salvas permanentemente</li>
                <li>Seu álbum estará pronto para ser compartilhado</li>
                <li>Você será redirecionado para o álbum publicado</li>
              </ul>
              <p className="mb-2">
                Certifique-se de que todas as suas fotos estão organizadas da maneira desejada, com
                datas, localizações e descrições adequadas.
              </p>
              <p className="font-medium">Tem certeza que deseja finalizar a edição agora?</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-medium hover:bg-secondary-10 transition-colors"
            onClick={onClose}
          >
            Voltar à edição
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-medium bg-primary text-background hover:bg-primary/90 transition-colors"
            onClick={onConfirm}
          >
            Sim, finalizar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
