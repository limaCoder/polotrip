/** biome-ignore-all lint/suspicious/noConsole: we are using console for logging */
import { createMCPClient } from "@ai-sdk/mcp";
import type { ToolSet } from "ai";

let mcpClientInstance: Awaited<ReturnType<typeof createMCPClient>> | null =
  null;

export async function getMCPClient() {
  if (mcpClientInstance) {
    return mcpClientInstance;
  }

  try {
    const mcpServerUrl = process.env.MCP_SERVER_URL || "http://localhost:3334";

    console.log(`Connecting to MCP server at: ${mcpServerUrl}`);

    mcpClientInstance = await createMCPClient({
      transport: {
        type: "http",
        url: `${mcpServerUrl}/mcp`,
      },
      name: "polotrip-server",
    });

    console.log("MCP client connected successfully");

    return mcpClientInstance;
  } catch (error) {
    console.error("Failed to connect to MCP server:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("Connection closed") ||
      errorMessage.includes("MCP error")
    ) {
      console.error(
        "MCP server connection failed. Make sure MCP_SECRET and DATABASE_URL are set in environment variables."
      );
    }

    mcpClientInstance = null;
    throw error;
  }
}

export async function getMCPToolsWithUserId(userId: string): Promise<ToolSet> {
  const client = await getMCPClient();
  const mcpTools = await client.tools();

  const wrappedTools: Record<string, unknown> = {};

  for (const [toolName, tool] of Object.entries(mcpTools)) {
    const originalExecute = tool.execute.bind(tool);
    wrappedTools[toolName] = {
      ...tool,
      execute: async (
        args: unknown,
        context?: { toolCallId?: string; messages?: unknown[] }
      ) => {
        const argsWithUserId = {
          ...(args as Record<string, unknown>),
          userId,
        };
        // Pass context if provided, otherwise create a minimal context
        const result = context
          ? await originalExecute(argsWithUserId, {
              toolCallId: context.toolCallId ?? "",
              messages: context.messages ?? [],
            } as Parameters<typeof originalExecute>[1])
          : await originalExecute(argsWithUserId, {
              toolCallId: "",
              messages: [],
            } as Parameters<typeof originalExecute>[1]);

        // Parse JSON string results from MCP tools to objects
        // MCP tools return JSON as string in content[0].text, but frontend needs objects
        // The @ai-sdk/mcp may already parse it, but we ensure it's an object

        // If result is already an object (not a string), return as-is
        if (result && typeof result === "object" && !Array.isArray(result)) {
          // Check if it's a CallToolResult with text property
          if ("text" in result && typeof result.text === "string") {
            try {
              const parsed = JSON.parse(result.text);
              console.log(
                `[MCP] Parsed tool result from text property for ${toolName}`
              );
              return parsed;
            } catch {
              // If parsing fails, return original result
              return result;
            }
          }

          // Check if it has content array with text
          if (
            "content" in result &&
            Array.isArray(result.content) &&
            result.content.length > 0 &&
            typeof result.content[0] === "object" &&
            result.content[0] !== null &&
            "text" in result.content[0] &&
            typeof result.content[0].text === "string"
          ) {
            try {
              const parsed = JSON.parse(result.content[0].text);
              console.log(
                `[MCP] Parsed tool result from content[0].text for ${toolName}`
              );
              return parsed;
            } catch {
              // If parsing fails, return original result
              return result;
            }
          }

          // If it's already a parsed object (like an array of albums), return as-is
          return result;
        }

        // If result is a string, try to parse it
        if (typeof result === "string") {
          try {
            const parsed = JSON.parse(result);
            console.log(`[MCP] Parsed tool result from string for ${toolName}`);
            return parsed;
          } catch {
            // If parsing fails, return original result
            return result;
          }
        }

        return result;
      },
    };
  }

  return wrappedTools as ToolSet;
}

export async function closeMCPClient() {
  if (mcpClientInstance) {
    await mcpClientInstance.close();
    mcpClientInstance = null;
    console.log("MCP client disconnected");
  }
}
