import type { Loader2 } from "lucide-react";
import type { VideoStatus, VideoStyle } from "@/http/get-video/types";

type VideoGeneratorProps = {
  albumId: string;
  albumTitle: string;
  photoCount: number;
  isPaid: boolean;
};

type VideoStyleSelectorProps = {
  selectedStyle: VideoStyle;
  onStyleSelect: (style: VideoStyle) => void;
  disabled?: boolean;
};

type VideoProgressProps = {
  status: VideoStatus;
  startedAt?: string | null;
};

type VideoPlayerProps = {
  videoUrl: string;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  track?: string | null;
};

type StatusConfig = {
  icon: typeof Loader2;
  colorClass: string;
  bgClass: string;
  animate?: boolean;
};

export type {
  VideoGeneratorProps,
  VideoStyleSelectorProps,
  VideoProgressProps,
  VideoPlayerProps,
  StatusConfig,
};
