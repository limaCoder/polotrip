"use client";

import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Music,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMusicPlayer } from "./use-music-player";

type MusicPlayerProps = {
  musicUrl: string | null;
};

export function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const t = useTranslations("PublicAlbum.MusicPlayer");
  const [isVolumeExpanded, setIsVolumeExpanded] = useState(false);
  const { isPlaying, isReady, volume, togglePlay, handleVolumeChange } =
    useMusicPlayer({
      musicUrl,
      shouldPlay: false,
    });

  if (!musicUrl) return null;

  const getPlayButtonIcon = () => {
    if (isReady) {
      return isPlaying ? (
        <Pause className="text-white" size={16} />
      ) : (
        <Play className="text-white" size={16} />
      );
    }
    return <Loader2 className="animate-spin text-white" size={16} />;
  };

  return (
    <>
      <div
        id="youtube-player"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
        }}
      />

      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-full bg-secondary p-3 shadow-lg backdrop-blur-sm transition-all duration-300">
        <div className="flex items-center gap-2">
          <Music
            className={isPlaying ? "animate-pulse text-white" : "text-white"}
            size={20}
          />
          <span className="font-body_two font-bold text-sm text-white">
            {isPlaying ? t("playing_label") : t("play_label")}
          </span>
        </div>

        <Button
          aria-label={isPlaying ? t("pause_aria") : t("play_aria")}
          className="h-8 w-8 rounded-full bg-white/20 p-0 hover:bg-white/30 disabled:cursor-not-allowed"
          disabled={!isReady}
          onClick={togglePlay}
          size="icon"
          type="button"
          variant="ghost"
        >
          {getPlayButtonIcon()}
        </Button>

        {isVolumeExpanded && (
          <div className="flex items-center gap-2">
            <Volume2 className="text-white" size={16} />
            <Slider
              aria-label={t("volume_aria")}
              className="w-20"
              disabled={!isReady}
              max={100}
              min={0}
              onValueChange={(value: [number]) => handleVolumeChange(value[0])}
              step={1}
              value={[volume]}
            />
          </div>
        )}

        <Button
          aria-label={isVolumeExpanded ? t("collapse_aria") : t("expand_aria")}
          className="h-8 w-8 rounded-full bg-white/20 p-0 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isReady}
          onClick={() => setIsVolumeExpanded(!isVolumeExpanded)}
          size="icon"
          type="button"
          variant="ghost"
        >
          {isVolumeExpanded ? (
            <ChevronDown className="text-white" size={16} />
          ) : (
            <ChevronUp className="text-white" size={16} />
          )}
        </Button>
      </div>
    </>
  );
}
