import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getAlbumsRoute } from './get-albums';
import { createAlbumRoute } from './create-album';
import { uploadPhotosRoute } from './upload-photos';
import { updateAlbumRoute } from './update-album';
import { getUploadUrlsRoute } from './get-upload-urls';
import { getPhotosByDateRoute } from './get-photos-by-date';
import { getAlbumDatesRoute } from './get-album-dates';
import { deletePhotosRoute } from './delete-photos';
import { getPublicAlbumRoute } from './get-public-album';
import { getPublicAlbumLocationsRoute } from './get-public-album-locations';
import { getPublicAlbumPhotosRoute } from './get-public-album-photos';
import { getAlbumRoute } from './get-album';

const albumsController: FastifyPluginAsyncZod = async app => {
  app.register(getAlbumsRoute);
  app.register(getAlbumRoute);
  app.register(createAlbumRoute);
  app.register(getUploadUrlsRoute);
  app.register(uploadPhotosRoute);
  app.register(updateAlbumRoute);
  app.register(getPhotosByDateRoute);
  app.register(getAlbumDatesRoute);
  app.register(deletePhotosRoute);

  app.register(getPublicAlbumRoute);
  app.register(getPublicAlbumLocationsRoute);
  app.register(getPublicAlbumPhotosRoute);
};

export default albumsController;
