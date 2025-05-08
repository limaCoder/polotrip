import { Trash2 } from 'lucide-react';
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
import { DeletePhotosDialogProps } from './types';

export function DeletePhotosDialog({
  isOpen,
  onClose,
  onConfirm,
  photoCount,
  isDeleting,
}: DeletePhotosDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="px-2 w-[90%] overflow-hidden">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 text-red-600 p-3 rounded-full">
              <Trash2 size={24} />
            </div>
          </div>
          <AlertDialogTitle className="text-center">Excluir fotos</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Tem certeza que deseja excluir {photoCount} {photoCount === 1 ? 'foto' : 'fotos'}{' '}
            selecionada
            {photoCount !== 1 ? 's' : ''}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-medium hover:bg-secondary-10 transition-colors"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Excluindo...</span>
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
