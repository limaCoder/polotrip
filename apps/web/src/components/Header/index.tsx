import { HeaderDesktop } from './components/Desktop';
import { HeaderMobile } from './components/Mobile';

export function Header() {
  return (
    <header>
      <HeaderDesktop />
      <HeaderMobile />
    </header>
  );
}
