import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getAlbumsRoute } from './get-albums';
import { createAlbumRoute } from './create-album';
import { uploadPhotosRoute } from './upload-photos';
import { updateAlbumRoute } from './update-album';
import { getAlbumByIdRoute } from './get-album-by-id';
import { getUploadUrlsRoute } from './get-upload-urls';
import { getPhotosByDateRoute } from './get-photos-by-date';
import { getAlbumDatesRoute } from './get-album-dates';
import { deletePhotosRoute } from './delete-photos';

const albumsController: FastifyPluginAsyncZod = async app => {
  app.register(getAlbumsRoute);
  app.register(createAlbumRoute);
  app.register(getUploadUrlsRoute);
  app.register(uploadPhotosRoute);
  app.register(updateAlbumRoute);
  app.register(getAlbumByIdRoute);
  app.register(getPhotosByDateRoute);
  app.register(getAlbumDatesRoute);
  app.register(deletePhotosRoute);
};

export default albumsController;
