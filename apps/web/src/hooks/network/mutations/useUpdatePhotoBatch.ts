"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { albumKeys } from "@/hooks/network/keys/albumKeys";
import { updateAlbum } from "@/http/update-album";

type PhotoBatchUpdate = {
  ids: string[];
  data: {
    dateTaken?: string | null;
    locationName?: string | null;
    description?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
};

type UseUpdatePhotoBatchProps = {
  albumId: string;
};

export const useUpdatePhotoBatch = ({ albumId }: UseUpdatePhotoBatchProps) => {
  const queryClient = useQueryClient();
  const t = useTranslations("UpdatePhotoBatchHook");

  return useMutation({
    mutationFn: async ({ ids, data }: PhotoBatchUpdate) => {
      const photoUpdates = ids.map((id) => ({
        id,
        ...data,
      }));

      return updateAlbum({
        params: { id: albumId },
        body: {
          photoUpdates,
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
