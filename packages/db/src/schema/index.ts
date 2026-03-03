import { albumVideos } from "./album-videos";
import { albums } from "./albums";
import { accounts, sessions, users, verifications } from "./auth-schema";
import { payments } from "./payments";
import { photoEmbeddings } from "./photo-embeddings";
import { photos } from "./photos";

const schema = {
  users,
  albums,
  photos,
  payments,
  sessions,
  accounts,
  verifications,
  albumVideos,
  photoEmbeddings,
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
  albumVideos,
  photoEmbeddings,
};
