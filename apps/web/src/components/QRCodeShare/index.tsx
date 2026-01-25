"use client";

import { Download } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePostHog } from "@/hooks/use-posthog";
import type { QRCodeShareProps } from "./types";

export function QRCodeShare({ url, size = 200 }: QRCodeShareProps) {
  const t = useTranslations("PublicAlbum.ShareModal");
  const { capture } = usePostHog();
  const { id: albumId } = useParams();

  const handleDownload = () => {
    try {
      const canvas = document.createElement("canvas");
      const svg = document.querySelector(
        `svg[aria-label="${t("qrcode_aria")}"]`
      );
      const ctx = canvas.getContext("2d");

      if (!(svg && ctx)) return;

      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "polotrip-qrcode.png";
        downloadLink.href = pngFile;
        downloadLink.click();

        capture("qrcode_downloaded", {
          album_id: albumId,
          qrcode_size: size,
          file_format: "png",
        });
      };

      img.src = svgUrl;
    } catch (_error) {
      toast.error(t("download_qrcode_error"));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        aria-label={t("qrcode_aria")}
        className="rounded-lg bg-white p-4 shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-primary hover:scale-105 hover:shadow-xl"
        role="img"
        style={{ outline: "none" }}
      >
        <QRCodeSVG
          aria-label={t("qrcode_aria")}
          bgColor="#fff"
          fgColor="#22223b"
          imageSettings={{
            src: "/brand/favicon.ico",
            height: 40,
            width: 40,
            excavate: true,
          }}
          includeMargin
          level="H"
          size={size}
          value={url}
        />
        <span className="sr-only">{t("qrcode_sr_text", { url })}</span>
      </div>

      <Button
        aria-label={t("download_qrcode_aria")}
        className="flex items-center gap-2 hover:bg-secondary/50"
        onClick={handleDownload}
        variant="outline"
      >
        <Download className="h-4 w-4" />
        {t("download_qrcode")}
      </Button>
    </div>
  );
}
