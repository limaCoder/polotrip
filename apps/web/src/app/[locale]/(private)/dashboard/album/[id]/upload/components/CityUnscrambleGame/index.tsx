"use client";

import { useTranslations } from "next-intl";
import type { CityUnscrambleGameProps } from "./types";
import { useCityUnscrambleGame } from "./useCityUnscrambleGame";

export function CityUnscrambleGame({ className }: CityUnscrambleGameProps) {
  const t = useTranslations("UploadPage.CityUnscrambleGame");
  const { score, input, currentCity, checkAnswer, handleInputChange } =
    useCityUnscrambleGame();

  return (
    <div className={className}>
      <div className="mb-4 text-center">
        <h3 className="mb-1 font-medium">{t("title")}</h3>
        <p className="mb-2 font-bold text-2xl">{currentCity.scrambled}</p>
        <p className="text-gray-500 text-sm">{currentCity.hint}</p>
      </div>

      <div className="mb-4 flex flex-col gap-2 lg:flex-row">
        <input
          className="flex-1 rounded-md border px-3 py-2"
          onChange={handleInputChange}
          onKeyUp={(e) => e.key === "Enter" && checkAnswer()}
          placeholder={t("placeholder")}
          type="text"
          value={input}
        />
        <button
          className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          onClick={checkAnswer}
          type="button"
        >
          {t("check_button")}
        </button>
      </div>

      <p className="text-center text-sm">
        {t("score")}: <span className="font-bold">{score}</span>
      </p>
    </div>
  );
}
