"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
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

import type { MetadataDialogProps } from "./types";

export function MetadataDialog({
  isOpen,
  onClose,
  onKeepMetadata,
  onRemoveMetadata,
}: MetadataDialogProps) {
  const [showConfirmRemoveDialog, setShowConfirmRemoveDialog] = useState(false);

  const t = useTranslations("UploadPage.MetadataDialog");

  const handleShowConfirmRemoveDialog = () => {
    setShowConfirmRemoveDialog(true);
  };

  const handleConfirmRemove = () => {
    setShowConfirmRemoveDialog(false);
    onRemoveMetadata();
  };

  const handleCancelRemove = () => {
    setShowConfirmRemoveDialog(false);
  };

  const handleKeepMetadata = () => {
    onKeepMetadata();
  };

  return (
    <>
      <AlertDialog
        onOpenChange={onClose}
        open={isOpen && !showConfirmRemoveDialog}
      >
        <AlertDialogContent className="w-[90%] overflow-hidden px-2">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("initial_dialog.title")}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>{t("initial_dialog.description_1")}</p>
                <ul className="mb-2 list-disc space-y-1 pl-5">
                  <li>{t("initial_dialog.item_1")}</li>
                  <li>{t("initial_dialog.item_2")}</li>
                </ul>
                <p className="mb-2">{t("initial_dialog.description_2")}</p>
                <p className="font-medium">
                  {t("initial_dialog.confirmation")}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-red-500 font-bold transition-colors hover:bg-red-600"
              onClick={handleShowConfirmRemoveDialog}
            >
              {t("initial_dialog.remove_button")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary font-bold"
              onClick={handleKeepMetadata}
            >
              {t("initial_dialog.keep_button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        onOpenChange={handleCancelRemove}
        open={showConfirmRemoveDialog}
      >
        <AlertDialogContent className="w-[90%] overflow-hidden px-2">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("confirm_remove_dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-2">{t("confirm_remove_dialog.description")}</p>
                <ul className="mb-2 list-disc space-y-1 pl-5">
                  <li>{t("confirm_remove_dialog.item_1")}</li>
                  <li>{t("confirm_remove_dialog.item_2")}</li>
                </ul>
                <p className="font-medium">
                  {t("confirm_remove_dialog.confirmation")}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-primary font-bold transition-colors hover:bg-primary/90"
              onClick={handleCancelRemove}
            >
              {t("confirm_remove_dialog.cancel_button")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 font-bold transition-colors hover:bg-red-600"
              onClick={handleConfirmRemove}
            >
              {t("confirm_remove_dialog.confirm_button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
