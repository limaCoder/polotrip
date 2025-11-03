export type DateCount = {
  date: string | null;
  count: number;
};

export type GetAlbumDatesRequest = {
  params: {
    albumId: string;
  };
};

export type GetAlbumDatesResponse = {
  dates: DateCount[];
};
