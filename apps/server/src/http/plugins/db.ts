import { client, db } from "@polotrip/db";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export default fp(
  async function fastifyDb(fastify: FastifyInstance) {
    if (fastify.db) {
      return;
    }

    try {
      fastify.decorate("db", db);

      fastify.addHook("onClose", async (fastifyInstance) => {
        if (fastifyInstance.db) {
          fastifyInstance.log.info("Closing db connection...");

          await client.end();

          fastifyInstance.log.info("DB connection closed.");
        }
      });
    } catch (error) {
      fastify.log.error(`Failed to establish db connection: ${error}`);

      throw error;
    }
  },
  {
    name: "db",
  }
);
