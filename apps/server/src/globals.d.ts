import type { PostgresJsDatabase } from '@/app/helpers/orm';
import type * as schema from '@polotrip/db/schema';

import type { AuthType } from '@polotrip/auth';

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>;
    auth: AuthType;
  }
}
