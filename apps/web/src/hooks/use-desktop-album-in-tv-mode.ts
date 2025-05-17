import { useCallback } from 'react';

export function useDesktopAlbumInTvMode() {
  const handleTvMode = useCallback(async () => {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }

    let animationFrameId: number;
    const scrollSpeed = 1;
    let isAutoScrolling = true;

    function smoothAutoScroll() {
      if (!isAutoScrolling) return;

      if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
        window.scrollBy({
          top: scrollSpeed,
          behavior: 'auto',
        });

        animationFrameId = requestAnimationFrame(smoothAutoScroll);
      }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        isAutoScrolling = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      }
    };

    const handleScroll = () => {
      if (isAutoScrolling) {
        isAutoScrolling = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchmove', handleScroll);

    smoothAutoScroll();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  return {
    handleTvMode,
  };
}
