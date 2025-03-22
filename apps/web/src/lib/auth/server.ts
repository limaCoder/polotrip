import { cache } from 'react';
import { headers } from 'next/headers';

import { auth } from '@polotrip/auth';

export const getCurrentUser = cache(
  async () => (await auth.api.getSession({ headers: await headers() }))?.user,
);
