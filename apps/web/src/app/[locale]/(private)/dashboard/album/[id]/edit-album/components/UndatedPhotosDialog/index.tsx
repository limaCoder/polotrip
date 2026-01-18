"use client";

import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { UndatedPhotosDialogProps } from "./types";

export function UndatedPhotosDialog({
  isOpen,
  onClose,
}: UndatedPhotosDialogProps) {
  const t = useTranslations("EditAlbum.UndatedPhotosDialog");

  return (
    <AlertDialog onOpenChange={onClose} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            className="transition-colors hover:bg-primary/90 hover:text-primary-foreground"
            onClick={onClose}
            variant="outline"
          >
            {t("confirm_button")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
