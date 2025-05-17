import { toast } from 'sonner';

interface ScreenOrientationWithLock extends ScreenOrientation {
  lock?: (orientation: OrientationType) => Promise<void>;
}

interface HTMLElementWithWebkit extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

type OrientationType =
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary';

const TOAST_DURATION = 4000;
const SCROLL_SPEED = 1;

const isIOS = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /iPad|iPhone|iPod/.test(userAgent);
};

const orientationMessage = {
  landscape: 'Para melhor experiência, gire seu aparelho para o modo paisagem (horizontal).',
} as const;

const fullscreenUtils = {
  async requestFullscreen(element: HTMLElement): Promise<void> {
    const el = element as HTMLElementWithWebkit;

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
    } catch (error) {
      console.error('Erro ao entrar em tela cheia:', error);
      throw error;
    }
  },

  async lockOrientation(): Promise<void> {
    if (!('orientation' in screen)) {
      throw new Error('Orientação não suportada');
    }

    const orientation = screen.orientation as ScreenOrientationWithLock;
    if (orientation.lock) {
      await orientation.lock('landscape-primary');
    } else {
      throw new Error('Bloqueio de orientação não suportado');
    }
  },
};

interface AutoScrollState {
  isAutoScrolling: boolean;
  animationFrameId?: number;
}

export function useMobileAlbumInTvMode() {
  const handleTvMode = async () => {
    const scrollState: AutoScrollState = {
      isAutoScrolling: true,
    };

    try {
      if (isIOS()) {
        toast.info(orientationMessage.landscape, {
          duration: TOAST_DURATION,
          richColors: true,
        });
        return;
      }

      await fullscreenUtils.requestFullscreen(document.documentElement);

      try {
        await fullscreenUtils.lockOrientation();
      } catch {
        toast.info(orientationMessage.landscape, {
          duration: TOAST_DURATION,
          richColors: true,
        });
      }

      const smoothAutoScroll = () => {
        if (!scrollState.isAutoScrolling) return;

        if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
          window.scrollBy({
            top: SCROLL_SPEED,
            behavior: 'auto',
          });

          scrollState.animationFrameId = requestAnimationFrame(smoothAutoScroll);
        }
      };

      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          scrollState.isAutoScrolling = false;
          if (scrollState.animationFrameId) {
            cancelAnimationFrame(scrollState.animationFrameId);
          }
        }
      };

      const handleScroll = () => {
        if (scrollState.isAutoScrolling) {
          scrollState.isAutoScrolling = false;
          if (scrollState.animationFrameId) {
            cancelAnimationFrame(scrollState.animationFrameId);
          }
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      window.addEventListener('wheel', handleScroll);
      window.addEventListener('touchmove', handleScroll);

      smoothAutoScroll();

      return () => {
        if (scrollState.animationFrameId) {
          cancelAnimationFrame(scrollState.animationFrameId);
        }

        document.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('wheel', handleScroll);
        window.removeEventListener('touchmove', handleScroll);
      };
    } catch (error) {
      console.error('Erro ao iniciar modo TV:', error);
      toast.error('Não foi possível iniciar o modo TV. Tente novamente.', {
        duration: TOAST_DURATION,
        richColors: true,
      });
    }
  };

  return {
    handleTvMode,
  };
}
