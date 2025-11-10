"use client";

import { useTranslations } from "next-intl";
import type { LoadingGameWrapperProps } from "./types";

export function LoadingGameWrapper({
  isCompressing,
  isUploading,
  children,
  className,
}: LoadingGameWrapperProps) {
  const t = useTranslations("LoadingGameWrapper");
  if (!(isCompressing || isUploading)) return null;

  return (
    <div
      className={`${className} mt-8 rounded-xl bg-secondary/5 p-2`}
      id="waiting-game"
    >
      <div className="mx-auto">
        <div className="mb-6 space-y-3 text-center">
          <h4 className="font-title_three text-primary">{t("title")}</h4>
          <p className="text-sm text-text/70">
            {isCompressing ? t("optimizing_tip") : t("uploading_tip")}
          </p>
        </div>

        <div className="rounded-lg bg-background p-4 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
