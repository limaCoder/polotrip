"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateAlbum } from "@/http/update-album";
import { albumKeys } from "../keys/albumKeys";

type UsePublishAlbumProps = {
  albumId: string;
  onSuccess?: () => void;
};

export const usePublishAlbum = ({
  albumId,
  onSuccess,
}: UsePublishAlbumProps) => {
  const queryClient = useQueryClient();
  const t = useTranslations("PublishAlbumHook");

  return useMutation({
    mutationFn: async () => {
      return updateAlbum({
        params: { id: albumId },
        body: {
          isPublished: true,
          currentStepAfterPayment: "published",
        },
      });
    },
    onSuccess: () => {
      toast.success(t("success_title"), {
        description: t("success_description"),
      });

      if (onSuccess) {
        onSuccess();
      }

      queryClient.invalidateQueries({
        queryKey: [albumKeys.all],
      });
    },
    onError: () => {
      toast.error(t("error_title"), {
        description: t("error_description"),
      });
    },
  });
};
