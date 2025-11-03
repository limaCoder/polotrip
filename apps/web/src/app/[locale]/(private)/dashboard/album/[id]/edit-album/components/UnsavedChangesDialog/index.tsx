"use client";

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
import type { UnsavedChangesDialogProps } from "./types";

export function UnsavedChangesDialog({
  isOpen,
  onClose,
  onConfirm,
}: UnsavedChangesDialogProps) {
  const t = useTranslations("EditAlbum.UnsavedChangesDialog");

  return (
    <AlertDialog onOpenChange={onClose} open={isOpen}>
      <AlertDialogContent className="w-[90%] overflow-hidden px-2">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="mb-2">{t("description_intro")}</p>
              <ul className="mb-2 list-disc space-y-1 pl-5">
                <li>{t("item_1")}</li>
                <li>{t("item_2")}</li>
              </ul>
              <p className="font-medium">{t("confirmation")}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-medium transition-colors hover:bg-secondary-10"
            onClick={onClose}
          >
            {t("cancel_button")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary font-medium text-background transition-colors hover:bg-primary/90"
            onClick={onConfirm}
          >
            {t("confirm_button")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
