"use client";

import { CheckCircle2, Music, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAlbumDetails } from "@/hooks/network/queries/useAlbumDetails";
import { api } from "@/http/api";
import {
  extractYouTubeVideoId,
  isValidYouTubeUrl,
} from "@/lib/utils/youtube-url";
import { MusicCardSkeleton } from "../skeletons";

export function MusicCard() {
  const { id: albumId } = useParams<{ id: string }>();
  const t = useTranslations("EditAlbum.MusicCard");
  const [musicUrl, setMusicUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const {
    data: album,
    refetch,
    isLoading: isAlbumLoading,
  } = useAlbumDetails(albumId);

  if (isAlbumLoading) {
    return <MusicCardSkeleton />;
  }

  const currentMusicUrl = album?.musicUrl || "";

  const handleSave = async () => {
    if (!musicUrl.trim()) {
      toast.error(t("input_error_invalid"));
      return;
    }

    if (!isValidYouTubeUrl(musicUrl)) {
      toast.error(t("input_error_youtube_only"));
      return;
    }

    setIsLoading(true);

    try {
      await api.patch(`v1/albums/${albumId}`, {
        json: {
          musicUrl: musicUrl.trim(),
        },
      });

      toast.success(t("save_success"));
      setMusicUrl("");
      setJustAdded(true);
      await refetch();

      setTimeout(() => {
        setJustAdded(false);
      }, 3000);
    } catch (_error) {
      toast.error(t("save_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);

    try {
      await api.patch(`v1/albums/${albumId}`, {
        json: {
          musicUrl: null,
        },
      });

      toast.success(t("remove_success"));
      setJustAdded(false);
      await refetch();
    } catch (_error) {
      toast.error(t("remove_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <div className="mb-3 flex items-center gap-3">
        <Music className="text-primary" size={24} />
        <h2 className="font-bold font-title_three">{t("title")}</h2>
      </div>

      <p className="mb-6 font-body_two text-text/75">{t("description")}</p>

      {currentMusicUrl ? (
        <div className="space-y-4">
          {justAdded && (
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
              <CheckCircle2 size={20} />
              <span className="font-body_two text-sm">
                {t("music_added_feedback")}
              </span>
            </div>
          )}
          <div className="overflow-hidden rounded-lg">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${extractYouTubeVideoId(currentMusicUrl)}`}
              title="YouTube video player"
            />
          </div>
          <Button
            aria-label={t("remove_button_aria")}
            className="flex w-full items-center justify-center gap-2 rounded bg-destructive px-8 py-3 font-body_two text-white hover:bg-destructive/90"
            disabled={isLoading}
            onClick={handleRemove}
            type="button"
          >
            <Trash2 size={16} />
            <span>{isLoading ? t("removing") : t("remove_button")}</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label
              className="mb-2 block font-body_two text-sm text-text/75"
              htmlFor="music-url"
            >
              {t("input_label")}
            </label>
            <Input
              disabled={isLoading}
              id="music-url"
              onChange={(e) => setMusicUrl(e.target.value)}
              placeholder={t("input_placeholder")}
              type="url"
              value={musicUrl}
            />
          </div>
          <Button
            aria-label={t("save_button_aria")}
            className="flex w-full items-center justify-center gap-2 rounded bg-primary px-8 py-3 font-body_two text-white hover:bg-primary/90"
            disabled={isLoading || !musicUrl.trim()}
            onClick={handleSave}
            type="button"
          >
            <Music size={16} />
            <span>{isLoading ? t("saving") : t("save_button")}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
