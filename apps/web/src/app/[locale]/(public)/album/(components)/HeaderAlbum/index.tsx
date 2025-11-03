import { HeaderAlbumDesktop } from "./Desktop";
import { HeaderAlbumMobile } from "./Mobile";
import type { HeaderAlbumProps } from "./types";

export function HeaderAlbum({
  albumTitle,
  albumDescription,
  albumOwnerName,
}: HeaderAlbumProps) {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 lg:px-9">
      <HeaderAlbumDesktop
        albumDescription={albumDescription}
        albumOwnerName={albumOwnerName}
        albumTitle={albumTitle}
      />
      <HeaderAlbumMobile
        albumDescription={albumDescription}
        albumOwnerName={albumOwnerName}
        albumTitle={albumTitle}
      />
    </header>
  );
}
