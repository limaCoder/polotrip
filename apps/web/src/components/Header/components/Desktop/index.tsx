import { Album } from 'lucide-react';
import { Button } from '@/components/Button';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

export function HeaderDesktop() {
  return (
    <div className="hidden lg:flex py-4 container relative justify-between items-center px-4">
      <img src="brand/logo.svg" alt="Logo" className="w-[150px] sm:w-full md:w-[180px]" />

      <div className="flex gap-4 items-center">
        <p className="block">Pronto para criar seus álbuns?</p>
        <Button href="/login" className="bg-gradient-primary text-white">
          <strong>Acessar conta</strong>
          <Album />
        </Button>
        <LocaleSwitcher />
      </div>
    </div>
  );
}
