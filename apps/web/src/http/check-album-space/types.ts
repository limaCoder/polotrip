type CheckAlbumSpaceRequest = {
  params: {
    albumId: string;
  };
};

type CheckAlbumSpaceResponse = {
  availableSpace: number;
  totalSpace: number;
  usedSpace: number;
  canUpload: boolean;
};

export type { CheckAlbumSpaceResponse, CheckAlbumSpaceRequest };
