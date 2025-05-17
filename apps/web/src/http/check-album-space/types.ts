interface CheckAlbumSpaceRequest {
  params: {
    albumId: string;
  };
}

interface CheckAlbumSpaceResponse {
  availableSpace: number;
  totalSpace: number;
  usedSpace: number;
  canUpload: boolean;
}

export type { CheckAlbumSpaceResponse, CheckAlbumSpaceRequest };
