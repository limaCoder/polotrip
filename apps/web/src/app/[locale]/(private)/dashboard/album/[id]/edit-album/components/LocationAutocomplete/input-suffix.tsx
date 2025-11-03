import { Loader2, X } from "lucide-react";
import type { InputSuffixProps } from "./types";

export function InputSuffix({
  isLoadingSearch,
  isLoadingReverseGeocode,
  inputValue,
  onClear,
}: InputSuffixProps) {
  if (isLoadingSearch || isLoadingReverseGeocode) {
    return <Loader2 className="shrink-0 animate-spin text-text/50" size={16} />;
  }

  if (inputValue) {
    return (
      <X
        className="shrink-0 cursor-pointer text-text/50 hover:text-text/75"
        onClick={onClear}
        size={16}
      />
    );
  }

  return null;
}
