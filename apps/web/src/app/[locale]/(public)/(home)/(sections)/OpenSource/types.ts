import type { ReactNode } from "react";

type OpenSourceFeatureData = {
  id: number;
  titleKey: "self_host_title" | "mcp_title" | "mit_title";
  descriptionKey:
    | "self_host_description"
    | "mcp_description"
    | "mit_description";
  icon: ReactNode;
};

export type { OpenSourceFeatureData };
