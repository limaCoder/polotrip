'use client';

import { useState } from 'react';
import { Album, X, Menu } from 'lucide-react';
import { Button } from '../Button';
import { LocaleSwitcher } from '../LocaleSwitcher';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="py-4 container relative flex justify-between items-center px-4">
        <img src="brand/logo.svg" alt="Logo" className="w-[150px] sm:w-full md:w-[180px]" />

        <button className="lg:hidden text-primary z-20" onClick={toggleMenu}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden lg:flex gap-4 items-center">
          <p className="hidden lg:block">Pronto para criar seus álbuns?</p>
          <Button
            href="/login"
            text="Acessar conta"
            className="bg-gradient-primary text-white"
            icon={<Album />}
          />
          <LocaleSwitcher />
        </div>

        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-[300px] bg-white bg-opacity-90 p-6 flex flex-col gap-4 items-start justify-center transition-transform duration-700 z-10 shadow-lg ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
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
          <Button
            href="/login"
            text="Acessar conta"
            className="bg-gradient-primary text-white w-full justify-center mt-3"
            icon={<Album />}
          />
          <div className="flex w-full justify-center">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
