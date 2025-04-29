import { toast } from 'sonner';

interface ScreenOrientationWithLock extends ScreenOrientation {
  lock?: (orientation: string) => Promise<void>;
}

export function useMobileAlbumInTvMode() {
  const handleTvMode = async () => {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }

    if ('orientation' in screen) {
      try {
        await (screen.orientation as ScreenOrientationWithLock).lock?.('landscape');
      } catch {
        toast.info(
          'Para melhor experiência, gire seu aparelho para o modo paisagem (horizontal).',
          {
            duration: 4000,
            richColors: true,
          },
        );
      }
    }

    const scrollStep = 10;
    const delay = 10;
    function smoothAutoScroll() {
      if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
        window.scrollBy(0, scrollStep);
        setTimeout(smoothAutoScroll, delay);
      }
    }
    smoothAutoScroll();
  };

  return {
    handleTvMode,
  };
}
