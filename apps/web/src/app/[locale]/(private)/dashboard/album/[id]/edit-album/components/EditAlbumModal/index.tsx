"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateAlbumCover } from "@/actions/updateAlbumCover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAlbumDetails } from "@/hooks/network/mutations/useUpdateAlbumDetails";
import { cn } from "@/lib/cn";
import type { EditAlbumFormValues, EditAlbumModalProps } from "./types";
import { UploadAreaContent } from "./upload-area-content";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export function EditAlbumModal({
  isOpen,
  onClose,
  albumId,
  initialData,
}: EditAlbumModalProps) {
  const { locale } = useParams();
  const t = useTranslations("EditAlbum.EditAlbumModal");

  const { mutate: updateAlbum, isPending: isUpdating } =
    useUpdateAlbumDetails();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit } = useForm<EditAlbumFormValues>({
    defaultValues: {
      title: initialData?.title,
      description: initialData?.description || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageError(null);

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setImageError(t("file_too_large_error"));
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setImageError(t("unsupported_format_error"));
        return;
      }

      setSelectedImage(file);
    }
  };

  const onSubmit = useCallback(
    async (data: EditAlbumFormValues) => {
      if (imageError) {
        return;
      }

      try {
        let coverImageUrl = initialData?.coverImageUrl;

        if (selectedImage) {
          startTransition(async () => {
            const formData = new FormData();
            formData.append("file", selectedImage);
            formData.append("albumId", albumId);
            if (initialData?.coverImageUrl) {
              formData.append("currentCoverUrl", initialData?.coverImageUrl);
            }

            const result = await updateAlbumCover(
              { locale: locale as string },
              null,
              formData
            );

            if (result?.error) {
              toast.error(result?.error);
              return;
            }

            coverImageUrl = result?.coverImageUrl;

            updateAlbum(
              {
                albumId,
                title: data?.title || undefined,
                description: data?.description || null,
                coverImageUrl,
              },
              {
                onSuccess: () => {
                  onClose();
                  setSelectedImage(null);
                  setImageError(null);
                },
              }
            );
          });

          return;
        }

        updateAlbum(
          {
            albumId,
            title: data?.title || undefined,
            description: data?.description || null,
            coverImageUrl,
          },
          {
            onSuccess: () => {
              onClose();
              setSelectedImage(null);
              setImageError(null);
            },
          }
        );
      } catch (_error) {
        toast.error(t("update_error"));
      }
    },
    [
      albumId,
      updateAlbum,
      onClose,
      selectedImage,
      initialData?.coverImageUrl,
      imageError,
      t,
      locale,
    ]
  );

  const isLoading = isPending || isUpdating;

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="overflow-hidden sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              {...register("title")}
              placeholder={t("title_placeholder")}
            />
          </div>

          <div>
            <Textarea
              {...register("description")}
              placeholder={t("description_placeholder")}
            />
          </div>

          <div>
            <div
              className={cn(
                "relative flex h-[116px] flex-col items-center justify-center rounded border border-dashed p-3 text-center",
                selectedImage ? "border-primary" : "border-text/25",
                imageError && "border-red-500"
              )}
            >
              <input
                accept="image/png, image/jpeg, image/jpg"
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                disabled={isLoading}
                onChange={handleImageChange}
                type="file"
              />
              <UploadAreaContent
                isLoading={isLoading}
                isPending={isPending}
                selectedImage={selectedImage}
                t={t}
              />
            </div>
            {imageError && (
              <p className="mt-2 text-red-500 text-sm">{imageError}</p>
            )}
            <div className="mt-2 rounded-lg bg-secondary/5 p-3">
              <p className="mb-2 font-body_two text-sm">
                {t("recommendations_title")}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-[68px] w-[120px] items-center justify-center rounded border border-primary/30 border-dashed bg-secondary/20">
                  <span className="text-[10px] text-primary/70">
                    {t("recommendations_size")}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text/70">
                    {t("recommendations_format")}
                  </p>
                  <p className="text-sm text-text/70">
                    {t("recommendations_resolution")}
                  </p>
                  <p className="text-sm text-text/70">
                    {t("recommendations_text")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              className="transition-colors hover:bg-secondary/40"
              disabled={isLoading}
              onClick={onClose}
              type="button"
              variant="outline"
            >
              {t("cancel_button")}
            </Button>
            <Button
              className="bg-primary text-white"
              disabled={isLoading || !!imageError}
              type="submit"
            >
              {isLoading ? t("saving_button") : t("save_button")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
