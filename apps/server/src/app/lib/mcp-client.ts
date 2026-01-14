import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { z } from "zod";

class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;

  async connect() {
    if (this.client) return this.client;

    try {
      // Path to MCP server executable
      const mcpServerPath = path.resolve(
        process.cwd(),
        "../mcp/dist/index.mjs"
      );

      // Create transport from process stdio
      this.transport = new StdioClientTransport({
        command: "node",
        args: [mcpServerPath],
      });

      this.client = new Client(
        {
          name: "polotrip-server",
          version: "1.0.0",
        },
        {
          capabilities: {},
        }
      );

      await this.client.connect(this.transport);
      // biome-ignore lint/suspicious/noConsole: MCP client logging
      console.log("MCP client connected successfully");

      return this.client;
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: MCP client error logging
      console.error("Failed to connect to MCP server:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.transport = null;
      // biome-ignore lint/suspicious/noConsole: MCP client logging
      console.log("MCP client disconnected");
    }
  }

  getClient() {
    return this.client;
  }

  async callTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<{ content: Array<{ type: string; text: string }> }> {
    const client = await this.connect();

    try {
      const result = await client.request(
        {
          method: "tools/call",
          params: {
            name: toolName,
            arguments: args,
          },
        },
        z.unknown()
      );

      return result as { content: Array<{ type: string; text: string }> };
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: MCP client error logging
      console.error(`Error calling tool ${toolName}:`, error);
      throw error;
    }
  }
}

export const mcpClient = new MCPClient();
