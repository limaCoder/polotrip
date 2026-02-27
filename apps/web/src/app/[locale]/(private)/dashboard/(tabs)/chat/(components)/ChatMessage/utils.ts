import type { ToolPart } from "./types";

const PHOTO_TOOL_NAMES = [
  "getPhotosByLocation",
  "getPhotosByDate",
  "getAlbumPhotos",
] as const;

function hasPhotos(output: unknown): boolean {
  if (Array.isArray(output)) {
    return output.length > 0;
  }
  if (
    output &&
    typeof output === "object" &&
    "photos" in output &&
    Array.isArray(output.photos)
  ) {
    return output.photos.length > 0;
  }
  return false;
}

function isPhotoTool(toolName: string): boolean {
  return PHOTO_TOOL_NAMES.includes(
    toolName as (typeof PHOTO_TOOL_NAMES)[number]
  );
}

export function filterToolsToShow(toolParts: ToolPart[]): ToolPart[] {
  const hasPhotoTools = toolParts.some((tool) => isPhotoTool(tool.toolName));

  const toolsToShow = hasPhotoTools
    ? toolParts.filter((tool) => tool.toolName !== "getAlbumByName")
    : toolParts;

  if (!hasPhotoTools) {
    return toolsToShow;
  }

  const completedPhotoOutputs = toolsToShow.filter(
    (tool) =>
      tool.state === "output-available" &&
      isPhotoTool(tool.toolName) &&
      tool.output != null
  );

  const outputsWithPhotos = completedPhotoOutputs.filter((tool) =>
    hasPhotos(tool.output)
  );

  if (outputsWithPhotos.length > 0) {
    return toolsToShow.filter((tool) => {
      if (tool.state === "input-available") {
        return false;
      }

      if (tool.state === "output-available" && isPhotoTool(tool.toolName)) {
        return hasPhotos(tool.output);
      }

      return false;
    });
  }

  return toolsToShow.filter((tool) => {
    if (tool.state === "input-available") {
      return false;
    }

    if (tool.state === "output-available" && isPhotoTool(tool.toolName)) {
      return hasPhotos(tool.output);
    }

    return tool.state === "output-available" && !isPhotoTool(tool.toolName);
  });
}

export function isToolPart(part: unknown): part is ToolPart {
  if (!part || typeof part !== "object") return false;
  return (
    "type" in part &&
    (part as { type?: unknown }).type === "dynamic-tool" &&
    "toolName" in part &&
    typeof (part as { toolName?: unknown }).toolName === "string" &&
    "state" in part &&
    ((part as { state?: unknown }).state === "input-available" ||
      (part as { state?: unknown }).state === "output-available")
  );
}

export function isTextPart(
  part: unknown
): part is { type: "text"; text: string } {
  if (!part || typeof part !== "object") return false;
  return (
    "type" in part &&
    (part as { type?: unknown }).type === "text" &&
    "text" in part &&
    typeof (part as { text?: unknown }).text === "string"
  );
}
