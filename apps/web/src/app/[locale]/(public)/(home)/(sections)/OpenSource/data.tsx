import { Bot, GitFork, Server } from "lucide-react";
import type { OpenSourceFeatureData } from "./types";

export const openSourceFeaturesData: OpenSourceFeatureData[] = [
  {
    id: 1,
    titleKey: "self_host_title",
    descriptionKey: "self_host_description",
    icon: <Server />,
  },
  {
    id: 2,
    titleKey: "mcp_title",
    descriptionKey: "mcp_description",
    icon: <Bot />,
  },
  {
    id: 3,
    titleKey: "mit_title",
    descriptionKey: "mit_description",
    icon: <GitFork />,
  },
];
