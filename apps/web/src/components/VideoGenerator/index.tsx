"use client";

import { AlertCircle, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useVideoGeneration } from "@/hooks/network/mutations/useVideoGeneration";
import type { VideoStyle } from "@/http/get-video/types";
import { cn } from "@/lib/cn";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import type { VideoGeneratorProps } from "./types";
import { VideoPlayer } from "./video-player";
import { VideoProgress } from "./video-progress";
import { VideoStyleSelector } from "./video-style-selector";

const MIN_PHOTOS_FOR_VIDEO = 5;

export function VideoGenerator({
  albumId,
  albumTitle,
  photoCount,
  isPaid,
}: VideoGeneratorProps) {
  const t = useTranslations("VideoGenerator");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>("emotional");

  const { video, isLoading, isGenerating, generateVideo } = useVideoGeneration({
    albumId,
    enabled: isOpen,
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    if (isVideoReady && video.videoUrl) {
      return (
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
      );
    }

    if (isVideoProcessing) {
      return (
        <VideoProgress startedAt={video!.startedAt} status={video!.status} />
      );
    }

    if (isVideoFailed) {
      return (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4 rounded-xl bg-red-500/10 p-6">
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
          <div className="space-y-4">
            <VideoStyleSelector
              disabled={isGenerating}
              onStyleSelect={setSelectedStyle}
              selectedStyle={selectedStyle}
            />
            <Button
              className="w-full"
              disabled={isGenerating}
              onClick={handleGenerateVideo}
            >
              {isGenerating ? t("generating") : t("try_again")}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <p className="text-center text-muted-foreground">
          {t("select_style_description")}
        </p>
        <VideoStyleSelector
          disabled={isGenerating}
          onStyleSelect={setSelectedStyle}
          selectedStyle={selectedStyle}
        />
        <Button
          className="w-full"
          disabled={isGenerating || !canGenerateVideo}
          onClick={handleGenerateVideo}
        >
          {isGenerating ? t("generating") : t("generate_video")}
        </Button>
        {!canGenerateVideo && (
          <p className="text-center text-muted-foreground text-sm">
            {isPaid
              ? t("min_photos_required", { count: MIN_PHOTOS_FOR_VIDEO })
              : t("album_not_paid")}
          </p>
        )}
      </div>
    );
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "flex w-full justify-start gap-2 border-none p-0 font-normal text-base text-primary shadow-none transition-all duration-300 hover:bg-[unset] hover:text-primary hover:brightness-130",
            isVideoReady && "border-green-500 text-green-500"
          )}
          variant="outline"
        >
          {isVideoReady ? t("watch_video") : t("create_video")}
          <Video className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isVideoReady ? t("your_video") : t("create_narrative_video")}
          </DialogTitle>
          <DialogDescription>
            {isVideoReady
              ? t("video_ready_description", { title: albumTitle })
              : t("create_video_description", { title: albumTitle })}
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
