'use client';

import { useState } from 'react';
import { Album, X, Menu } from 'lucide-react';
import { ButtonNavigation } from '@/components/ButtonNavigation';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { cn } from '@/lib/cn';

export function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="lg:hidden bg-background py-4 container relative flex justify-between items-center px-4">
      <img src="/brand/logo.svg" alt="Logo" className="w-[150px] sm:w-full md:w-[180px]" />

      <button className="text-primary z-20" onClick={toggleMenu}>
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={cn(
          'absolute top-0 left-0 w-full h-[300px] bg-background p-6 flex flex-col gap-4 items-start justify-center transition-transform duration-700 z-10 shadow-lg',
          isMenuOpen ? 'translate-y-16' : '-translate-y-full',
        )}
      >
        <a href="#vantagens" className="text-black" onClick={toggleMenu}>
          Vantagens
        </a>
        <a href="#como-funciona" className="text-black" onClick={toggleMenu}>
          Como funciona
        </a>
        <a href="#perguntas-frequentes" className="text-black" onClick={toggleMenu}>
          Perguntas frequentes
        </a>
        <ButtonNavigation
          href="/login"
          className="bg-gradient-primary text-white w-full justify-center mt-3"
        >
          <strong>Acessar conta</strong>
          <Album />
        </ButtonNavigation>
        <div className="flex w-full justify-center">
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
}
