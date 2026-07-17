"use client";

import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/cn";
import type { VideoPlayerProps } from "./types";

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  durationSeconds,
  track,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = Number.parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const duration = durationSeconds || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-black">
      <video
        className="aspect-video w-full"
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        playsInline
        poster={thumbnailUrl || undefined}
        ref={videoRef}
        src={videoUrl}
      >
        <track
          kind="captions"
          label="Português"
          src={track || undefined}
          srcLang="pt-BR"
        />
      </video>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity",
          isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        )}
      >
        <button
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 transition-transform hover:scale-110"
          onClick={togglePlay}
          type="button"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-black" />
          ) : (
            <Play className="h-8 w-8 translate-x-0.5 text-black" />
          )}
        </button>
      </div>

      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-4 transition-opacity",
          isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm text-white">{formatTime(currentTime)}</span>
          <input
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/30"
            max={duration}
            min={0}
            onChange={handleSeek}
            style={{
              background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`,
            }}
            type="range"
            value={currentTime}
          />
          <span className="text-sm text-white">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="rounded-full p-1 transition-colors hover:bg-white/20"
              onClick={togglePlay}
              type="button"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white" />
              )}
            </button>
            <button
              className="rounded-full p-1 transition-colors hover:bg-white/20"
              onClick={toggleMute}
              type="button"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
          <button
            className="rounded-full p-1 transition-colors hover:bg-white/20"
            onClick={handleFullscreen}
            type="button"
          >
            <Maximize className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
