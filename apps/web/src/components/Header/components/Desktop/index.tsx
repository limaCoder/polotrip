import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { HomeContent } from './home-content';

export function HeaderDesktop() {
  return (
    <div className="hidden lg:flex py-4 container relative justify-between items-center px-4">
      <img src="/brand/logo.svg" alt="Logo" className="w-[150px] sm:w-full md:w-[180px]" />

      <div className="flex gap-4 items-center">
        <HomeContent />
        <LocaleSwitcher />
      </div>
    </div>
  );
}
