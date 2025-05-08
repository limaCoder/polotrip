type GetAlbumRequest = {
  albumId: string;
  signal?: AbortSignal;
};

type GetAlbumResponse = {
  album: {
    id: string;
    title: string;
    description: string | null;
    coverImageUrl: string | null;
    date: string;
  };
  user: {
    name: string;
  };
};

export type { GetAlbumRequest, GetAlbumResponse };
