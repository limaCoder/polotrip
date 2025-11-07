"use client";

import { Share2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePostHog } from "@/hooks/usePostHog";
import { cn } from "@/lib/cn";
import type { ShareButtonsProps } from "./types";

export function ShareButtons({
  url,
  title,
  description,
  ownerName,
}: ShareButtonsProps) {
  const t = useTranslations("PublicAlbum.ShareModal");
  const { capture } = usePostHog();
  const { id: albumId } = useParams();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const urlWithShareFlag = `${url}?share=true`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");

  const shareText = description
    ? t("share_text_with_description", { title, description, ownerName })
    : t("share_text_without_description", { title, ownerName });

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${urlWithShareFlag}`)}`,
  };

  const handleWhatsAppShare = () => {
    capture("album_shared", {
      album_id: albumId,
      share_method: "whatsapp",
      album_title: title,
    });
    window.open(shareLinks.whatsapp, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Polotrip`,
          text: shareText,
          url: urlWithShareFlag,
        });

        capture("album_shared", {
          album_id: albumId,
          share_method: "native_share",
          album_title: title,
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        toast.error(t("share_error"));
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success(t("link_copied_toast"));

      capture("album_shared", {
        album_id: albumId,
        share_method: "copy_link_fallback",
        album_title: title,
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(urlWithShareFlag);
    toast.success(t("link_copied_toast"));

    capture("album_shared", {
      album_id: albumId,
      share_method: "copy_link",
      album_title: title,
    });
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center justify-center gap-4">
        <Button
          className="h-12 w-12 hover:bg-secondary/50"
          onClick={handleWhatsAppShare}
          size="icon"
          variant="outline"
        >
          <div className="relative h-6 w-6">
            <Image
              alt={t("whatsapp_icon_alt")}
              className={cn(
                "absolute inset-0 transition-opacity duration-200",
                isDarkMode ? "opacity-0" : "opacity-100"
              )}
              height={24}
              src="/icons/whatsapp.svg"
              width={24}
            />
            <Image
              alt={t("whatsapp_icon_alt")}
              className={cn(
                "absolute inset-0 transition-opacity duration-200",
                isDarkMode ? "opacity-100" : "opacity-0"
              )}
              height={24}
              src="/icons/whatsapp-white.svg"
              width={24}
            />
          </div>
        </Button>

        <Button
          className="h-12 w-12 hover:bg-secondary/50"
          onClick={handleShare}
          size="icon"
          variant="outline"
        >
          <Share2 className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded-md border bg-background px-3 py-2"
          readOnly
          type="text"
          value={urlWithShareFlag}
        />
        <Button onClick={handleCopyLink} variant="secondary">
          {t("copy_button")}
        </Button>
      </div>
    </div>
  );
}
