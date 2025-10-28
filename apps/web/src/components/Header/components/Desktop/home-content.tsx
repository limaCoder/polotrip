import { Album } from 'lucide-react';
import { ButtonNavigation } from '@/components/ButtonNavigation';
import { cn } from '@/lib/cn';
import { HomeContentProps } from '../../types';

export function HomeContent({ isHome: isHomeFromParent = false }: HomeContentProps) {
  if (!isHomeFromParent) return null;

  return (
    <>
      <p className={cn('block', isHomeFromParent && 'text-white drop-shadow-lg')}>
        Pronto para criar seus álbuns?
      </p>
      <ButtonNavigation
        href="/sign-in"
        className="bg-gradient-primary text-white button-shadow"
        aria-label="Acessar conta"
      >
        <span className="font-bold">Acessar conta</span>
        <Album />
      </ButtonNavigation>
    </>
  );
}
