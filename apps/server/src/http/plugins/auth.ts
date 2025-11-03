import { auth } from "@polotrip/auth";
import fp from "fastify-plugin";

export default fp(
  async function fastifyAuth(fastify) {
    if (fastify.auth) {
      return;
    }

    try {
      if (!auth?.handler) {
        throw new Error("Auth handler is not available");
      }

      fastify.decorate("auth", auth);
      fastify.log.info("Auth plugin registered successfully");
    } catch (error) {
      fastify.log.error(`Auth Plugin Error: ${error}`);
      throw error;
    }
  },
  {
    name: "auth",
    dependencies: ["db"],
  }
);
