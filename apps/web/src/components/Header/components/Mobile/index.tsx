'use client';

import { useState } from 'react';
import { Album, X, Menu } from 'lucide-react';
import { ButtonNavigation } from '@/components/ButtonNavigation';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/routing';
import { DashboardContent } from '../../dashboard-content';

const IS_INTERNATIONALIZATION_ENABLED = false;

export function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const isDashboardPage = pathname === '/dashboard';
  const isDashboardDirectory = pathname.startsWith('/dashboard');

  const logoHref = isDashboardDirectory ? `/dashboard` : `/`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="lg:hidden bg-background py-4 container relative flex justify-between items-center px-4">
      <Link href={logoHref}>
        <Image
          src="/brand/logo.svg"
          alt="Logo"
          width={180}
          height={40}
          className="w-[150px] md:w-[180px]"
          sizes="(max-width: 768px) 150px, 180px"
          priority
        />
      </Link>

      <div className="flex items-center gap-2">
        {!isHomePage && IS_INTERNATIONALIZATION_ENABLED && <LocaleSwitcher />}

        {isDashboardPage && <DashboardContent />}
      </div>

      {isHomePage && (
        <button className="text-primary z-20" onClick={toggleMenu} aria-label="Abrir menu">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      <div
        className={cn(
          'absolute top-0 left-0 w-full bg-background p-6 flex flex-col gap-4 items-start justify-center transition-transform duration-700 z-10 shadow-lg',
          isMenuOpen ? 'translate-y-16' : '-translate-y-full',
        )}
      >
        <>
          <a href="#benefits" className="text-black" onClick={toggleMenu} aria-label="Vantagens">
            Vantagens
          </a>
          <a
            href="#how-it-works"
            className="text-black"
            onClick={toggleMenu}
            aria-label="Como funciona"
          >
            Como funciona
          </a>
          <a
            href="#faq"
            className="text-black"
            onClick={toggleMenu}
            aria-label="Perguntas frequentes"
          >
            Perguntas frequentes
          </a>
          <ButtonNavigation
            href="/sign-in"
            className="bg-gradient-primary text-white w-full justify-center mt-3"
            aria-label="Acessar conta"
          >
            <span className="font-semibold">Acessar conta</span>
            <Album />
          </ButtonNavigation>
        </>

        {IS_INTERNATIONALIZATION_ENABLED && (
          <div className="flex w-full justify-center">
            <LocaleSwitcher />
          </div>
        )}
      </div>
    </div>
  );
}
