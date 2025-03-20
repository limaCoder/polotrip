import type { PostgresJsDatabase } from '@/app/helpers/orm';
import type * as schema from '@polotrip/db/schema';

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>;
  }
}
