type ShareAlbumModalProps = {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
  albumTitle: string;
  albumOwnerName: string;
  albumDescription?: string;
};

export type { ShareAlbumModalProps };
