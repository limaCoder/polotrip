"use client";

import { Calendar } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { formatDateToDisplay } from "@/utils/dates";
import type { PhotoTimelineProps } from "./types";

export function PhotoTimeline({
  dates,
  selectedDate,
  onSelectDate,
}: PhotoTimelineProps) {
  const t = useTranslations("EditAlbum.PhotoTimeline");
  const tDates = useTranslations("DatesUtils");
  const locale = useLocale() as "pt" | "en";

  const sortedDates = [...dates].sort((a, b) => {
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return a.date.localeCompare(b.date);
  });

  return (
    <div className="rounded-lg bg-card p-8 shadow">
      <div className="mb-6 flex items-center gap-3">
        <Calendar className="text-primary" size={24} />
        <h2 className="font-bold font-title_three">{t("title")}</h2>
      </div>

      <div className="flex flex-col gap-4">
        {sortedDates.map((dateCount) => (
          <button
            aria-label={t("select_date_aria", {
              date: formatDateToDisplay(dateCount?.date, locale, tDates),
            })}
            className={cn(
              "flex flex-col items-start rounded-lg p-2 transition-colors",
              selectedDate === dateCount?.date
                ? "bg-primary"
                : "hover:bg-secondary/10"
            )}
            key={dateCount?.date || "no-date"}
            onClick={() => onSelectDate(dateCount?.date)}
            type="button"
          >
            <p
              className={cn(
                "text-left font-body_two font-bold",
                selectedDate === dateCount?.date ? "text-background" : ""
              )}
            >
              {formatDateToDisplay(dateCount?.date, locale, tDates)}
            </p>
            <p
              className={cn(
                "font-body_two text-sm",
                selectedDate === dateCount?.date ? "text-background" : ""
              )}
            >
              {dateCount?.count}{" "}
              {dateCount?.count === 1 ? t("photo_singular") : t("photo_plural")}
            </p>
          </button>
        ))}

        {dates?.length === 0 && (
          <p className="text-center text-text/50 italic">
            {t("no_photos_found")}
          </p>
        )}
      </div>
    </div>
  );
}
