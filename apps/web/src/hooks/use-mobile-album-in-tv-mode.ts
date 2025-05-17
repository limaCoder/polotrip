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
  iosLimitation:
    'Devido a limitações do iOS, o modo tela cheia não está disponível em iPhones e iPads. Em PCs e dispositivos Android, o modo tela cheia funciona normalmente.',
} as const;

const showToast = (message: string, duration = TOAST_DURATION) => {
  toast.info(message, {
    duration,
    richColors: true,
  });
};

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

class AutoScroll {
  private state: AutoScrollState;
  private cleanup?: () => void;

  constructor() {
    this.state = {
      isAutoScrolling: true,
    };
  }

  private smoothAutoScroll = () => {
    if (!this.state.isAutoScrolling) return;

    if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
      window.scrollBy({
        top: SCROLL_SPEED,
        behavior: 'auto',
      });

      this.state.animationFrameId = requestAnimationFrame(this.smoothAutoScroll);
    }
  };

  private handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.stop();
    }
  };

  private handleScroll = () => {
    if (this.state.isAutoScrolling) {
      this.stop();
    }
  };

  private stop() {
    this.state.isAutoScrolling = false;
    if (this.state.animationFrameId) {
      cancelAnimationFrame(this.state.animationFrameId);
    }
  }

  start() {
    document.addEventListener('keydown', this.handleKeyPress);
    window.addEventListener('wheel', this.handleScroll);
    window.addEventListener('touchmove', this.handleScroll);

    this.smoothAutoScroll();

    this.cleanup = () => {
      this.stop();
      document.removeEventListener('keydown', this.handleKeyPress);
      window.removeEventListener('wheel', this.handleScroll);
      window.removeEventListener('touchmove', this.handleScroll);
    };

    return this.cleanup;
  }
}

export function useMobileAlbumInTvMode() {
  const handleTvMode = async () => {
    try {
      const autoScroll = new AutoScroll();

      if (isIOS()) {
        showToast(orientationMessage.iosLimitation, TOAST_DURATION * 3);

        return;
      }

      await fullscreenUtils.requestFullscreen(document.documentElement);

      try {
        await fullscreenUtils.lockOrientation();
      } catch {
        showToast(orientationMessage.landscape);
      }

      return autoScroll.start();
    } catch (error) {
      console.error('Erro ao iniciar modo TV:', error);
      showToast('Não foi possível iniciar o modo TV. Tente novamente.');
    }
  };

  return {
    handleTvMode,
  };
}
