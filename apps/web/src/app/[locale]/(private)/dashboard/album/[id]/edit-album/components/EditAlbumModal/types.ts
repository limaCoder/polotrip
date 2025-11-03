import type { useTranslations } from "next-intl";

type EditAlbumModalProps = {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
  initialData: {
    title: string;
    description?: string | null;
    coverImageUrl?: string | null;
  };
};

type EditAlbumFormValues = {
  title: string;
  description: string;
};

type UploadAreaContentProps = {
  isLoading: boolean;
  isPending: boolean;
  selectedImage: File | null;
  t: ReturnType<typeof useTranslations>;
};

export type {
  EditAlbumModalProps,
  EditAlbumFormValues,
  UploadAreaContentProps,
};
