/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: biome is not aware of the FastifyInstance type */
import type { AuthType } from "@polotrip/auth";
import type * as schema from "@polotrip/db/schema";
import type { PostgresJsDatabase } from "@/app/helpers/orm";

declare module "fastify" {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>;
    auth: AuthType;
  }
}
