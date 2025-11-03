import type { ReactNode } from "react";

type LoadingGameWrapperProps = {
  isCompressing: boolean;
  isUploading: boolean;
  children: ReactNode;
  className?: string;
};

export type { LoadingGameWrapperProps };
