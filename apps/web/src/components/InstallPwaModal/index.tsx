"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { InstallPwaModalProps } from "./types";

export function InstallPwaModal({
  isOpen,
  onClose,
  onInstall,
}: InstallPwaModalProps) {
  const t = useTranslations("Dashboard.install_pwa");

  const handleOpenInstallGuide = () => {
    window.open("https://www.installpwa.com/from/polotrip.com", "_blank");
    onInstall?.();
    onClose();
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="w-[90%] overflow-hidden px-2">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-muted-foreground">
          {t("description")}
        </DialogDescription>
        <DialogFooter>
          <div className="flex w-full gap-4">
            <Button
              aria-label={t("later_button_aria")}
              className="w-full"
              onClick={onClose}
              variant="outline"
            >
              {t("later_button")}
            </Button>

            <Button
              aria-label={t("install_button_aria")}
              className="flex w-full items-center gap-2 text-white"
              onClick={handleOpenInstallGuide}
            >
              {t("install_button")}
              <ExternalLink size={16} />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
