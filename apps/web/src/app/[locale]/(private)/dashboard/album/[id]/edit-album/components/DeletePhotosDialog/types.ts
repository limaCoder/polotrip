type DeletePhotosDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  photoCount: number;
  isDeleting: boolean;
};

export type { DeletePhotosDialogProps };
