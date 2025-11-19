import { getPublicAlbum } from "@/http/get-public-album";
import { MusicPlayer } from "../MusicPlayer";
import type { MusicPlayerSectionProps } from "./types";

export async function MusicPlayerContent({ albumId }: MusicPlayerSectionProps) {
  const albumData = await getPublicAlbum({ albumId });
  return <MusicPlayer musicUrl={albumData?.album?.musicUrl || null} />;
}
