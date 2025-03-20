import { HeaderDesktop } from './components/Desktop';
import { HeaderMobile } from './components/Mobile';

export function Header() {
  return (
    <header className="fixed lg:relative w-full z-50">
      <HeaderDesktop />
      <HeaderMobile />
    </header>
  );
}
