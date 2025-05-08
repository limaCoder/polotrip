interface ShareAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
  albumTitle: string;
  albumDescription?: string;
}

export type { ShareAlbumModalProps };
