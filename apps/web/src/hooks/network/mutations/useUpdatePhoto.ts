"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateAlbum } from "@/http/update-album";
import { albumKeys } from "../keys/albumKeys";

type PhotoUpdate = {
  id: string;
  dateTaken?: string | null;
  locationName?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type UseUpdatePhotoProps = {
  albumId: string;
};

export const useUpdatePhoto = ({ albumId }: UseUpdatePhotoProps) => {
  const queryClient = useQueryClient();
  const t = useTranslations("UpdatePhotoHook");

  return useMutation({
    mutationFn: async (photoUpdate: PhotoUpdate) => {
      return updateAlbum({
        params: { id: albumId },
        body: {
          photoUpdates: [photoUpdate],
        },
      });
    },
    onSuccess: () => {
      toast.success(t("success"));
      queryClient.invalidateQueries({ queryKey: albumKeys.photos(albumId) });
      queryClient.invalidateQueries({ queryKey: albumKeys.dates(albumId) });
    },
    onError: () => {
      toast.error(t("error_title"), {
        description: t("error_description"),
      });
    },
  });
};
