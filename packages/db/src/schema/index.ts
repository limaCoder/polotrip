import { albums } from './albums';
import { photos } from './photos';
import { payments } from './payments';
import { users, sessions, accounts, verifications } from './auth-schema';

const schema = {
  users: users,
  albums: albums,
  photos: photos,
  payments: payments,
  sessions: sessions,
  accounts: accounts,
  verifications: verifications,
};

export { schema, users, albums, photos, payments, sessions, accounts, verifications };
