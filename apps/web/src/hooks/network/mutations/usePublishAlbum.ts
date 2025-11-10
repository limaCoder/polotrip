"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { revalidateAlbumCache } from "@/app/actions/revalidate-album-cache";
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
  const locale = useLocale();

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
    onSuccess: async () => {
      toast.success(t("success_title"), {
        description: t("success_description"),
      });

      queryClient.invalidateQueries({
        queryKey: [albumKeys.all],
      });

      await revalidateAlbumCache(albumId, locale);

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      toast.error(t("error_title"), {
        description: t("error_description"),
      });
    },
  });
};
