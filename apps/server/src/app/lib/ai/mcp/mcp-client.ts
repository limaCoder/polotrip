/** biome-ignore-all lint/suspicious/noConsole: we are using console for logging */
import { createMCPClient } from "@ai-sdk/mcp";
import type { ToolSet } from "ai";
import { parseMcpToolResult } from "./mcp-tool-result-parser";

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
        const executeContext = context
          ? {
              toolCallId: context.toolCallId ?? "",
              messages: context.messages ?? [],
            }
          : { toolCallId: "", messages: [] };
        const result = await originalExecute(
          argsWithUserId,
          executeContext as Parameters<typeof originalExecute>[1]
        );
        return parseMcpToolResult(result);
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
