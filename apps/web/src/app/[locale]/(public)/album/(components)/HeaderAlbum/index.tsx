import { HeaderAlbumDesktop } from './Desktop';
import { HeaderAlbumMobile } from './Mobile';

export function HeaderAlbum() {
  return (
    <header className="relative z-20 w-full max-w-7xl mx-auto px-4 lg:px-9 py-4 flex justify-between items-center">
      <HeaderAlbumDesktop />
      <HeaderAlbumMobile />
    </header>
  );
}
