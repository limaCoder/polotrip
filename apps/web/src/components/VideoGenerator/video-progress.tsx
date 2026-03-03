"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/cn";
import { STATUS_CONFIG } from "./constants";
import type { VideoProgressProps } from "./types";

export function VideoProgress({ status, startedAt }: VideoProgressProps) {
  const t = useTranslations("VideoGenerator.progress");

  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const getElapsedTime = () => {
    if (!startedAt) return null;
    const start = new Date(startedAt);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const elapsedTime = getElapsedTime();

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl p-6",
        config.bgClass
      )}
    >
      <Icon
        className={cn(
          "h-12 w-12",
          config.colorClass,
          config.animate && "animate-spin"
        )}
      />
      <div className="text-center">
        <h4 className="font-semibold text-lg">{t(`status.${status}`)}</h4>
        <p className="text-muted-foreground text-sm">
          {t(`description.${status}`)}
        </p>
        {elapsedTime && status === "processing" && (
          <p className="mt-2 text-muted-foreground text-sm">
            {t("elapsed_time", { time: elapsedTime })}
          </p>
        )}
      </div>
    </div>
  );
}
