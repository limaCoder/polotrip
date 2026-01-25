"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { QRCodeShare } from "@/components/QRCodeShare";
import { ShareButtons } from "@/components/ShareButtons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostHog } from "@/hooks/use-posthog";
import type { ShareAlbumModalProps } from "./types";

export function ShareAlbumModal({
  isOpen,
  onClose,
  albumId,
  albumTitle,
  albumDescription,
  albumOwnerName,
}: ShareAlbumModalProps) {
  const t = useTranslations("PublicAlbum.ShareModal");
  const { locale } = useParams();
  const { capture } = usePostHog();
  const shareUrl = `${window.location.origin}/${locale}/album/${albumId}`;

  useEffect(() => {
    if (isOpen) {
      capture("share_modal_opened", {
        album_id: albumId,
        album_title: albumTitle,
      });
    }
  }, [isOpen, capture, albumId, albumTitle]);

  const handleTabChange = (value: string) => {
    if (value === "qrcode") {
      capture("qrcode_tab_viewed", {
        album_id: albumId,
        album_title: albumTitle,
      });
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="w-[90%] overflow-hidden px-2">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <Tabs
          className="w-full"
          defaultValue="links"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              className="data-[state=active]:bg-secondary"
              value="links"
            >
              {t("links_tab")}
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-secondary"
              value="qrcode"
            >
              {t("qrcode_tab")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <ShareButtons
              description={albumDescription}
              ownerName={albumOwnerName}
              title={albumTitle}
              url={shareUrl}
            />
          </TabsContent>

          <TabsContent value="qrcode">
            <QRCodeShare url={shareUrl} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
