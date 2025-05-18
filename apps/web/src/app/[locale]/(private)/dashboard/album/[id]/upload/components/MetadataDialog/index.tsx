'use client';

import { useState } from 'react';
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

import { MetadataDialogProps } from './types';

export function MetadataDialog({
  isOpen,
  onClose,
  onKeepMetadata,
  onRemoveMetadata,
}: MetadataDialogProps) {
  const [showConfirmRemoveDialog, setShowConfirmRemoveDialog] = useState(false);

  const handleShowConfirmRemoveDialog = () => {
    setShowConfirmRemoveDialog(true);
  };

  const handleConfirmRemove = () => {
    setShowConfirmRemoveDialog(false);
    onRemoveMetadata();
  };

  const handleCancelRemove = () => {
    setShowConfirmRemoveDialog(false);
  };

  const handleKeepMetadata = () => {
    onKeepMetadata();
  };

  return (
    <>
      <AlertDialog open={isOpen && !showConfirmRemoveDialog} onOpenChange={onClose}>
        <AlertDialogContent className="px-2 w-[90%] overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>Informação sobre metadados das fotos</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>
                  As fotos que você está enviando contêm metadados de localização geográfica. Estes
                  dados podem aprimorar significativamente sua experiência na plataforma:
                </p>
                <ul className="list-disc pl-5 mb-2 space-y-1">
                  <li>Visualização das fotos em um mapa interativo</li>
                  <li>Organização automática por local</li>
                </ul>
                <p className="mb-2">
                  Todos os metadados serão tratados com o mesmo nível de segurança dos seus demais
                  dados pessoais, em conformidade com a LGPD (Brasil) e GDPR (Europa).
                </p>
                <p className="font-medium">Você deseja manter estes metadados?</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="font-bold bg-red-500 text-background hover:bg-red-600 transition-colors"
              onClick={handleShowConfirmRemoveDialog}
            >
              Remover metadados
            </AlertDialogCancel>
            <AlertDialogAction
              className="font-bold bg-primary text-background"
              onClick={handleKeepMetadata}
            >
              Manter metadados
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmRemoveDialog} onOpenChange={handleCancelRemove}>
        <AlertDialogContent className="px-2 w-[90%] overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção dos metadados?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-2">
                  A remoção dos metadados afetará algumas funcionalidades importantes da plataforma:
                </p>
                <ul className="list-disc pl-5 mb-2 space-y-1">
                  <li>O mapa interativo não mostrará a localização das fotos</li>
                  <li>Você precisará inserir manualmente estas informações posteriormente</li>
                </ul>
                <p className="font-medium">
                  Tem certeza que deseja remover os metadados de suas fotos?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="font-bold bg-primary text-background hover:bg-primary/90 transition-colors"
              onClick={handleCancelRemove}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="font-bold bg-red-500 text-background hover:bg-red-600 transition-colors"
              onClick={handleConfirmRemove}
            >
              Sim, remover metadados
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
