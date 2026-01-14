"use client";

import type { UIMessage } from "@ai-sdk/react";
import { Bot, Loader2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import { ChatPhotoDisplay } from "./chat-photo-display";

type ChatMessageProps = {
  message: UIMessage;
};

type ToolPartState = "input-available" | "output-available";
type ToolPart = {
  type: "dynamic-tool";
  toolName: string;
  toolCallId: string;
  state: ToolPartState;
  input?: unknown;
  output?: unknown;
};

function isToolPart(part: unknown): part is ToolPart {
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

export function ChatMessage({ message }: ChatMessageProps) {
  const t = useTranslations("Chat.message");
  const isUser = message.role === "user";

  const parts = (message.parts ?? []) as unknown[];
  const toolParts = parts.filter(isToolPart);
  const textParts = parts.filter(
    (part): part is { type: "text"; text: string } =>
      !!part &&
      typeof part === "object" &&
      "type" in part &&
      (part as { type?: unknown }).type === "text" &&
      "text" in part &&
      typeof (part as { text?: unknown }).text === "string"
  );
  const text = textParts.map((p) => p.text).join("");

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary">
            <Bot className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-3",
          isUser ? "max-w-[80%]" : "max-w-[90%]"
        )}
      >
        {/* Text content */}
        {text.length > 0 && (
          <div
            className={cn(
              "rounded-lg px-4 py-2",
              isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <p className="whitespace-pre-wrap text-sm">{text}</p>
          </div>
        )}

        {/* Tool invocations and results */}
        {!isUser && toolParts.length > 0 && (
          <div className="space-y-2">
            {(() => {
              // Filter out intermediate tool outputs and loading states
              // If there are photo-related tools (in any state), hide getAlbumByName completely
              const photoToolNames = [
                "getPhotosByLocation",
                "getPhotosByDate",
                "getAlbumPhotos",
              ];
              const hasPhotoTools = toolParts.some((tool) =>
                photoToolNames.includes(tool.toolName)
              );

              // Filter tools to show: hide getAlbumByName completely if there are photo tools
              let toolsToShow = hasPhotoTools
                ? toolParts.filter((tool) => tool.toolName !== "getAlbumByName")
                : toolParts;

              // If there are photo tools, filter to show only final results with photos
              // Hide ALL intermediate steps and loading states during streaming
              if (hasPhotoTools) {
                // Check if there are any completed outputs with photos
                const completedPhotoOutputs = toolsToShow.filter(
                  (tool) =>
                    tool.state === "output-available" &&
                    photoToolNames.includes(tool.toolName) &&
                    tool.output != null
                );

                const outputsWithPhotos = completedPhotoOutputs.filter(
                  (tool) => {
                    const output = tool.output;
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
                );

                // If there are completed outputs with photos, show ONLY those (hide all loading states and empty results)
                if (outputsWithPhotos.length > 0) {
                  toolsToShow = toolsToShow.filter((tool) => {
                    // Hide all loading states when we have final results
                    if (tool.state === "input-available") {
                      return false;
                    }

                    // Show only completed outputs with photos
                    if (
                      tool.state === "output-available" &&
                      photoToolNames.includes(tool.toolName)
                    ) {
                      const output = tool.output;
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

                    // Hide all other tools when we have photo results
                    return false;
                  });
                } else {
                  // No completed outputs yet - hide all loading states to avoid showing intermediate steps
                  toolsToShow = toolsToShow.filter((tool) => {
                    // Don't show loading states during streaming
                    if (tool.state === "input-available") {
                      return false;
                    }
                    // Don't show incomplete outputs during streaming
                    if (
                      tool.state === "output-available" &&
                      photoToolNames.includes(tool.toolName)
                    ) {
                      const output = tool.output;
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
                    // Keep other tools (getUserAlbums, getTripStats, etc.) only if they're completed
                    return (
                      tool.state === "output-available" &&
                      !photoToolNames.includes(tool.toolName)
                    );
                  });
                }
              }

              return toolsToShow.map((tool) => {
                const toolName = tool.toolName;
                const key = `${message.id}:${tool.toolCallId}:${tool.state}`;

                // Show loading state for pending tools
                if (tool.state === "input-available") {
                  return (
                    <div
                      className="flex items-center gap-2 text-muted-foreground text-xs"
                      key={key}
                    >
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>
                        {toolName === "getUserAlbums" && t("fetching_albums")}
                        {toolName === "getAlbumPhotos" && t("loading_photos")}
                        {toolName === "getTripStats" && t("calculating_stats")}
                        {toolName === "getPhotosByDate" &&
                          t("searching_by_date")}
                        {toolName === "getPhotosByLocation" &&
                          t("finding_by_location")}
                        {toolName === "getAlbumByName" && t("searching_albums")}
                        {![
                          "getUserAlbums",
                          "getAlbumPhotos",
                          "getTripStats",
                          "getPhotosByDate",
                          "getPhotosByLocation",
                          "getAlbumByName",
                        ].includes(toolName) && t("working")}
                      </span>
                    </div>
                  );
                }

                // Show result with visual display
                if (tool.state === "output-available" && tool.output != null) {
                  const data = tool.output;
                  return (
                    <div className="mt-2" key={key}>
                      <ChatPhotoDisplay data={data} />
                    </div>
                  );
                }

                return null;
              });
            })()}
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-secondary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
