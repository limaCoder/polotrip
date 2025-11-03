"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DeletePhotosDialogProps } from "./types";

export function DeletePhotosDialog({
  isOpen,
  onClose,
  onConfirm,
  photoCount,
  isDeleting,
}: DeletePhotosDialogProps) {
  const t = useTranslations("EditAlbum.DeletePhotosDialog");

  const description =
    photoCount === 1
      ? t("description_singular", { count: photoCount })
      : t("description_plural", { count: photoCount });

  return (
    <AlertDialog onOpenChange={onClose} open={isOpen}>
      <AlertDialogContent className="w-[90%] overflow-hidden px-2">
        <AlertDialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <Trash2 size={24} />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            {t("title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-medium transition-colors hover:bg-secondary-10"
            disabled={isDeleting}
            onClick={onClose}
          >
            {t("cancel_button")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex items-center justify-center gap-2 bg-red-600 font-medium text-white transition-colors hover:bg-red-700"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-white border-b-2" />
                <span>{t("deleting_button")}</span>
              </>
            ) : (
              t("delete_button")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
