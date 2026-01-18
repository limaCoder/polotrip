import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RegisterableMcpTool } from "../types";
import { tools } from "./index";

function createMcpToolHandler(tool: RegisterableMcpTool) {
  return async (params: unknown) => {
    try {
      const result = await tool.handler(params);
      const response: {
        content: Array<{ type: "text"; text: string }>;
        isError?: boolean;
      } = {
        content: result.content.map((item) => ({
          type: "text" as const,
          text: item.text,
        })),
      };
      if ("isError" in result && result.isError) {
        response.isError = true;
      }
      return response;
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred",
            }),
          },
        ],
        isError: true,
      };
    }
  };
}

export function registerAllTools(server: McpServer): void {
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: tool.name,
        description: tool.description,
        inputSchema: tool.zodInputSchema,
      },
      createMcpToolHandler(tool)
    );
  }
}
