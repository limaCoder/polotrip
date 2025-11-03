import type { DateCount } from "@/http/get-album-dates/types";

type PhotoTimelineProps = {
  dates: DateCount[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
};

export type { PhotoTimelineProps };
