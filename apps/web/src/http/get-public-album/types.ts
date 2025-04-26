type GetPublicAlbumRequest = {
  albumId: string;
  signal?: AbortSignal;
};

type GetPublicAlbumResponse = {
  album: {
    id: string;
    title: string;
    description: string | null;
    coverImageUrl: string | null;
    date: string;
  };
};

export type { GetPublicAlbumRequest, GetPublicAlbumResponse };
