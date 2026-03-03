"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useVideoGeneration } from "@/hooks/network/mutations/useVideoGeneration";
import { useAlbumDetails } from "@/hooks/network/queries/useAlbumDetails";
import { useGetAlbumDates } from "@/hooks/network/queries/useGetAlbumDates";
import type { VideoStyle } from "@/http/get-video/types";
import { Button } from "../ui/button";
import type { VideoGeneratorProps } from "./types";
import { VideoPlayer } from "./video-player";
import { VideoProgress } from "./video-progress";
import { VideoStyleSelector } from "./video-style-selector";

const MIN_PHOTOS_FOR_VIDEO = 5;

export function VideoGenerator({
  albumId,
  albumTitle: initialAlbumTitle,
  photoCount: initialPhotoCount,
  isPaid: initialIsPaid,
}: VideoGeneratorProps) {
  const t = useTranslations("VideoGenerator");
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>("emotional");

  const { data: album, isLoading: isLoadingAlbum } = useAlbumDetails(albumId, {
    enabled:
      !initialAlbumTitle ||
      initialPhotoCount === undefined ||
      initialIsPaid === undefined,
  });

  const { data: albumDates } = useGetAlbumDates({
    albumId,
    enabled: initialPhotoCount === undefined && !album?.photoCount,
  });

  const albumTitle = initialAlbumTitle || album?.title;
  const photoCount =
    initialPhotoCount ??
    album?.photoCount ??
    albumDates?.dates.reduce(
      (acc: number, curr: { count: number }) => acc + curr.count,
      0
    ) ??
    0;
  const isPaid =
    initialIsPaid ?? album?.currentStepAfterPayment === "published";

  const { video, isLoading, isGenerating, generateVideo } = useVideoGeneration({
    albumId,
    enabled: true,
  });

  const canGenerateVideo = isPaid && photoCount >= MIN_PHOTOS_FOR_VIDEO;
  const isVideoReady = video?.status === "success" && video.videoUrl;
  const isVideoProcessing =
    video?.status === "pending" || video?.status === "processing";
  const isVideoFailed = video?.status === "failed";

  const handleGenerateVideo = async () => {
    try {
      await generateVideo(selectedStyle);
    } catch (_err) {
      toast.error(t("generation_failed"));
    }
  };

  if (isLoadingAlbum) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isVideoReady && video.videoUrl) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-background/20 bg-background/40 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="mb-4 font-bold font-title_three text-2xl tracking-tight">
            {t("your_video")}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {t("video_ready_description", { title: albumTitle })}
          </p>
          <div className="space-y-4">
            <VideoPlayer
              durationSeconds={video.durationSeconds}
              thumbnailUrl={video.thumbnailUrl}
              track={video.scriptText}
              videoUrl={video.videoUrl}
            />
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => window.open(video.videoUrl!, "_blank")}
                variant="outline"
              >
                {t("download_video")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isVideoProcessing) {
    return (
      <div className="rounded-2xl border border-background/20 bg-background/40 p-8 text-center shadow-xl backdrop-blur-xl">
        <h2 className="mb-4 font-bold font-title_three text-2xl tracking-tight">
          {t("generating")}
        </h2>
        <VideoProgress startedAt={video!.startedAt} status={video!.status} />
      </div>
    );
  }

  if (isVideoFailed) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-background/20 bg-background/40 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-6 flex flex-col items-center gap-4 rounded-xl bg-red-500/10 p-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h4 className="font-semibold text-lg">
                {t("generation_failed")}
              </h4>
              <p className="text-muted-foreground text-sm">
                {video!.errorMessage || t("unknown_error")}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <VideoStyleSelector
              disabled={isGenerating}
              onStyleSelect={setSelectedStyle}
              selectedStyle={selectedStyle}
            />
            <Button
              className="w-full shrink-0 items-center justify-center rounded-xl bg-gradient-primary px-10 py-6 font-body_one font-semibold text-white shadow-[0_4px_14px_0_rgba(41,128,185,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(41,128,185,0.23)]"
              disabled={isGenerating}
              onClick={handleGenerateVideo}
            >
              {isGenerating ? t("generating") : t("try_again")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-background/20 bg-background/40 p-6 shadow-xl backdrop-blur-xl transition-all duration-300">
      <div className="space-y-6">
        <VideoStyleSelector
          disabled={isGenerating}
          onStyleSelect={setSelectedStyle}
          selectedStyle={selectedStyle}
        />
        <Button
          className="group relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-primary px-10 py-6 font-body_one font-semibold text-white shadow-[0_4px_14px_0_rgba(41,128,185,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(41,128,185,0.23)]"
          disabled={isGenerating || !canGenerateVideo}
          onClick={handleGenerateVideo}
        >
          <div className="absolute inset-0 z-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="relative z-10">
            {isGenerating ? t("generating") : t("generate_video")}
          </span>
        </Button>
        {!canGenerateVideo && (
          <p className="text-center text-muted-foreground text-sm">
            {isPaid
              ? t("min_photos_required", { count: MIN_PHOTOS_FOR_VIDEO })
              : t("album_not_paid")}
          </p>
        )}
      </div>
    </div>
  );
}
