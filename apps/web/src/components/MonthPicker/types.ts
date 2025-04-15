interface MonthPickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  name?: string;
}

export type { MonthPickerProps };
