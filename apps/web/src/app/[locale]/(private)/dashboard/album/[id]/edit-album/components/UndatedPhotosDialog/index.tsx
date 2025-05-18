import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { UndatedPhotosDialogProps } from './types';

export function UndatedPhotosDialog({ isOpen, onClose }: UndatedPhotosDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Fotos sem data definida</AlertDialogTitle>
          <AlertDialogDescription>
            Existem fotos sem data definida no seu álbum. Para que todas as fotos sejam exibidas
            corretamente na timeline pública do álbum, é necessário definir uma data para cada foto.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-primary/90 hover:text-background transition-colors"
          >
            Entendi, vou revisar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
