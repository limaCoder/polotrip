import { sql } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

const healthRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: z.object({
            status: z.string(),
            timestamp: z.string(),
            uptime: z.number(),
            database: z.object({
              status: z.string(),
              latency: z.number(),
            }),
            version: z.string(),
          }),
        },
      },
    },
    async (request) => {
      const startTime = performance.now();
      let dbStatus = "ok";
      let dbLatency = 0;

      try {
        await request.server.db.execute(sql`SELECT 1`);
        dbLatency = Math.round(performance.now() - startTime);
      } catch (error) {
        dbStatus = "error";
        app.log.error("Database check failed:", error);
      }

      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: dbStatus,
          latency: dbLatency,
        },
        version: process.env.npm_package_version || "0.1.0",
      };
    }
  );
};

export default healthRoute;
