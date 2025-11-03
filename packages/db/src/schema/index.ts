import { albums } from "./albums";
import { accounts, sessions, users, verifications } from "./auth-schema";
import { payments } from "./payments";
import { photos } from "./photos";

const schema = {
  users,
  albums,
  photos,
  payments,
  sessions,
  accounts,
  verifications,
};

export {
  schema,
  users,
  albums,
  photos,
  payments,
  sessions,
  accounts,
  verifications,
};
