import type { RegisterableMcpTool } from "../types.js";
import { getAlbumByNameTool } from "./get-album-by-name.js";
import { getAlbumPhotosTool } from "./get-album-photos.js";
import { getPhotosByDateTool } from "./get-photos-by-date.js";
import { getPhotosByLocationTool } from "./get-photos-by-location.js";
import { getTripStatsTool } from "./get-trip-stats.js";
import { getUserAlbumsTool } from "./get-user-albums.js";
import { searchPhotosAcrossAlbumsTool } from "./search-photos-across-albums.js";

export const tools: RegisterableMcpTool[] = [
  getUserAlbumsTool,
  getAlbumPhotosTool,
  getPhotosByDateTool,
  getTripStatsTool,
  getPhotosByLocationTool,
  getAlbumByNameTool,
  searchPhotosAcrossAlbumsTool,
];
