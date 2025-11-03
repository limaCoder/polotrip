"use client";

import type { useTranslations } from "next-intl";
import { toast } from "sonner";

interface ScreenOrientationWithLock extends ScreenOrientation {
  lock?: (orientation: OrientationType) => Promise<void>;
}

interface HTMLElementWithWebkit extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

type OrientationType =
  | "portrait-primary"
  | "portrait-secondary"
  | "landscape-primary"
  | "landscape-secondary";

const TOAST_DURATION = 4000;
const SCROLL_SPEED = 5;

const IS_IOS_REGEX = /iPad|iPhone|iPod/;

const isIOS = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return IS_IOS_REGEX.test(userAgent);
};

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
      // biome-ignore lint/suspicious/noConsole: we need to use console.error for logging
      console.error("Error entering fullscreen:", error);
      throw error;
    }
  },

  async lockOrientation(): Promise<void> {
    if (!("orientation" in screen)) {
      throw new Error("Orientação não suportada");
    }

    const orientation = screen.orientation as ScreenOrientationWithLock;
    if (orientation.lock) {
      await orientation.lock("landscape-primary");
    } else {
      throw new Error("Bloqueio de orientação não suportado");
    }
  },
};

type AutoScrollState = {
  isAutoScrolling: boolean;
  animationFrameId?: number;
};

class AutoScroll {
  private readonly state: AutoScrollState;
  private cleanup?: () => void;

  constructor() {
    this.state = {
      isAutoScrolling: true,
    };
  }

  private readonly smoothAutoScroll = () => {
    if (!this.state.isAutoScrolling) return;

    if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
      window.scrollBy({
        top: SCROLL_SPEED,
        behavior: "auto",
      });

      this.state.animationFrameId = requestAnimationFrame(
        this.smoothAutoScroll
      );
    }
  };

  private readonly handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.stop();
    }
  };

  private readonly handleScroll = () => {
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
    document.addEventListener("keydown", this.handleKeyPress);
    window.addEventListener("wheel", this.handleScroll);
    window.addEventListener("touchmove", this.handleScroll);

    this.smoothAutoScroll();

    this.cleanup = () => {
      this.stop();
      document.removeEventListener("keydown", this.handleKeyPress);
      window.removeEventListener("wheel", this.handleScroll);
      window.removeEventListener("touchmove", this.handleScroll);
    };

    return this.cleanup;
  }
}

type UseMobileAlbumInTvModeProps = {
  t: ReturnType<typeof useTranslations<"MobileAlbumInTvMode">>;
};

export function useMobileAlbumInTvMode({ t }: UseMobileAlbumInTvModeProps) {
  const handleTvMode = async () => {
    try {
      const autoScroll = new AutoScroll();

      if (isIOS()) {
        showToast(t("iosLimitation"), TOAST_DURATION * 3);

        return;
      }

      await fullscreenUtils.requestFullscreen(document.documentElement);

      try {
        await fullscreenUtils.lockOrientation();
      } catch {
        showToast(t("landscape"));
      }

      return autoScroll.start();
    } catch (_error) {
      showToast(t("start_error"));
    }
  };

  return {
    handleTvMode,
  };
}
