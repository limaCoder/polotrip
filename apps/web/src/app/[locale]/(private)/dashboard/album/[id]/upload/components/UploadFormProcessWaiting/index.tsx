"use client";

import { useTranslations } from "next-intl";
import waitingAnimation from "@/assets/lottie/waiting.json" with {
  type: "json",
};
import LottieAnimation from "@/components/LottieAnimation";
import type { UploadFormProcessWaitingProps } from "./types";

function UploadFormProcessWaiting({
  isCompressingState,
  uploadFormState,
}: UploadFormProcessWaitingProps) {
  const t = useTranslations("UploadPage.UploadFormProcessWaiting");

  return (
    <div className="w-full space-y-6 py-4">
      <div className="space-y-2 text-center">
        <h3 className="font-title_three text-primary">
          {isCompressingState ? t("optimizing_title") : t("uploading_title")}
        </h3>
        <p className="text-text/70">
          {isCompressingState
            ? t("optimizing_description")
            : t("uploading_description", {
                progress: uploadFormState.progress,
              })}
        </p>
      </div>

      <div className="h-[250px] w-full overflow-hidden rounded-lg lg:h-[320px]">
        <LottieAnimation animationData={waitingAnimation} />
      </div>

      <div className="mx-auto max-w-md space-y-4 text-center">
        <p className="text-sm text-text/70">
          {isCompressingState ? t("optimizing_tip") : t("uploading_tip")}
        </p>

        <a
          className="inline-flex items-center gap-2 rounded-lg bg-secondary/10 px-6 py-3 transition-colors hover:bg-secondary/20"
          href="#waiting-game"
        >
          <span className="font-medium text-sm">{t("play_game_button")}</span>
          <svg
            aria-label={t("play_game_button")}
            fill="none"
            height="20"
            role="img"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="20"
          >
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
          </svg>
        </a>
      </div>

      {uploadFormState?.progress > 0 && (
        <div className="mx-auto max-w-md">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${uploadFormState.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { UploadFormProcessWaiting };
