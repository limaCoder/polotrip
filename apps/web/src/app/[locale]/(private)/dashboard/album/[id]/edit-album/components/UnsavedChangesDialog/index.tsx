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
import { UnsavedChangesDialogProps } from './types';

export function UnsavedChangesDialog({ isOpen, onClose, onConfirm }: UnsavedChangesDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alterações não salvas</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-2">Você tem alterações não salvas no formulário. Se continuar:</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li>As alterações atuais serão perdidas</li>
              <li>O formulário será preenchido com os dados da nova seleção</li>
            </ul>
            <p className="font-medium">Deseja continuar mesmo assim?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-medium hover:bg-secondary-10 transition-colors"
            onClick={onClose}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-medium bg-primary text-background hover:bg-primary/90 transition-colors"
            onClick={onConfirm}
          >
            Sim, continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
