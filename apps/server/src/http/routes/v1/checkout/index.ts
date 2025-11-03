import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import createCheckoutRoute from "./create-checkout";

const checkoutController: FastifyPluginAsyncZod = async (app) => {
  app.register(createCheckoutRoute);
};

export default checkoutController;
