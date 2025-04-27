import { DateCount } from '@/http/get-album-dates/types';

interface PhotoTimelineProps {
  dates: DateCount[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export type { PhotoTimelineProps };
