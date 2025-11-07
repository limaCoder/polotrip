import { useEffect, useRef, useState } from "react";
import { extractYouTubeVideoId } from "@/lib/utils/youtube-url";

declare global {
  // biome-ignore lint: biome does not support interface declarations
  interface Window {
    YT: {
      Player: new (
        element: string,
        options: {
          videoId: string;
          events: {
            onReady: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
          playerVars?: {
            autoplay?: number;
            controls?: number;
            modestbranding?: number;
            rel?: number;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
};

type UseMusicPlayerProps = {
  musicUrl: string | null;
  shouldPlay: boolean;
};

export function useMusicPlayer({ musicUrl, shouldPlay }: UseMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (!musicUrl) return;

    const videoId = extractYouTubeVideoId(musicUrl);
    if (!videoId) return;

    let isMounted = true;

    const loadYouTubeAPI = () => {
      if (!isMounted) return;

      if (window.YT?.Player) {
        initializePlayer(videoId);
        return;
      }

      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        window.onYouTubeIframeAPIReady = () => {
          if (isMounted) initializePlayer(videoId);
        };
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        if (isMounted) initializePlayer(videoId);
      };
    };

    // biome-ignore lint/nursery/noShadow: biome does not support shadowing
    const initializePlayer = (videoId: string) => {
      if (!isMounted || playerRef.current || isInitializingRef.current) return;

      isInitializingRef.current = true;

      try {
        playerRef.current = new window.YT.Player("youtube-player", {
          videoId,
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              setIsReady(true);
              event.target.setVolume(50);
              if (shouldPlay) {
                event.target.playVideo();
              }
              isInitializingRef.current = false;
            },
            onStateChange: (event) => {
              if (!isMounted) return;
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            },
          },
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
          },
        });
      } catch {
        isInitializingRef.current = false;
      }
    };

    loadYouTubeAPI();

    return () => {
      isMounted = false;
    };
  }, [musicUrl, shouldPlay]);

  const togglePlay = () => {
    if (!(playerRef.current && isReady)) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (playerRef.current && isReady) {
      playerRef.current.setVolume(newVolume);
    }
  };

  return {
    isPlaying,
    isReady,
    volume,
    togglePlay,
    handleVolumeChange,
  };
}
