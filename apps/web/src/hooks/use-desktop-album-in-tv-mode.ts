import { useCallback } from 'react';

export function useDesktopAlbumInTvMode() {
  const handleTvMode = useCallback(async () => {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
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
  }, []);

  return {
    handleTvMode,
  };
}
