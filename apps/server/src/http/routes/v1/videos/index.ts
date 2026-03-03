import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { createVideoRoute } from "./create-video";
import { getVideoRoute } from "./get-video";
import { updateVideoStatusRoute } from "./update-video-status";

const videosController: FastifyPluginAsyncZod = async (app) => {
  app.register(createVideoRoute);
  app.register(getVideoRoute);
  app.register(updateVideoStatusRoute);
};

export default videosController;
