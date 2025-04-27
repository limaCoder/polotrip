import { Album } from '@polotrip/db/models';

export type DeletePhotosRequest = {
  params: {
    albumId: string;
  };
  body: {
    photoIds: string[];
  };
};

export type DeletePhotosResponse = {
  success: boolean;
  deletedCount: number;
  message: string;
};
