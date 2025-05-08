interface EditAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
  initialData: {
    title: string;
    description?: string | null;
    coverImageUrl?: string | null;
  };
}

interface EditAlbumFormValues {
  title: string;
  description: string;
}

export type { EditAlbumModalProps, EditAlbumFormValues };
