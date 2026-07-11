"use client";

import { useEffect, useRef } from "react";

type HeroBackgroundProps = {
  alt: string;
};

export function HeroBackground({ alt }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = () => {
      if (mediaQuery.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        void video.play().catch(() => {
          // Autoplay can fail in restricted environments; poster remains visible.
        });
      }
    };

    applyMotionPreference();
    mediaQuery.addEventListener("change", applyMotionPreference);
    return () => mediaQuery.removeEventListener("change", applyMotionPreference);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        aria-label={alt}
        autoPlay
        className="absolute inset-0 h-full w-full object-cover object-[center_72%] sm:object-bottom dark:brightness-[0.72] dark:contrast-105 dark:saturate-90"
        loop
        muted
        playsInline
        poster="/pages/home/hero/hero-scene.jpg"
        preload="auto"
      >
        <source src="/pages/home/hero/hero-scene.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-b from-background/70 via-background/25 to-transparent dark:from-background/65 dark:via-background/30 dark:to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[42%] bg-linear-to-b from-background/40 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}
