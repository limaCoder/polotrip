/** biome-ignore-all lint/suspicious/noConsole: we are using console for logging */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { env } from "./env.js";
import { getAlbumByNameTool } from "./tools/get-album-by-name.js";
import { getAlbumPhotosTool } from "./tools/get-album-photos.js";
import { getPhotosByDateTool } from "./tools/get-photos-by-date.js";
import { getPhotosByLocationTool } from "./tools/get-photos-by-location.js";
import { getTripStatsTool } from "./tools/get-trip-stats.js";
import { getUserAlbumsTool } from "./tools/get-user-albums.js";
import { tools } from "./tools/index.js";

const server = new McpServer({
  name: "polotrip-mcp",
  version: "1.0.0",
});

server.registerTool(
  getUserAlbumsTool.name,
  {
    title: getUserAlbumsTool.name,
    description: getUserAlbumsTool.description,
    inputSchema: z.object({
      userId: z.string().describe("User ID"),
      limit: z.number().optional().default(10).describe("Max albums to return"),
    }),
  },
  async (params) => {
    try {
      const result = await getUserAlbumsTool.handler(params);
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
  }
);

server.registerTool(
  getAlbumPhotosTool.name,
  {
    title: getAlbumPhotosTool.name,
    description: getAlbumPhotosTool.description,
    inputSchema: z.object({
      albumId: z.string().describe("Album ID"),
      userId: z.string().describe("User ID (for authorization)"),
      limit: z.number().optional().default(20).describe("Max photos to return"),
    }),
  },
  async (params) => {
    try {
      const result = await getAlbumPhotosTool.handler(params);
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
  }
);

server.registerTool(
  getPhotosByDateTool.name,
  {
    title: getPhotosByDateTool.name,
    description: getPhotosByDateTool.description,
    inputSchema: z.object({
      albumId: z.string().describe("Album ID"),
      userId: z.string().describe("User ID (for authorization)"),
      date: z.string().describe("Date to filter photos (YYYY-MM-DD format)"),
      limit: z.number().optional().default(50).describe("Max photos to return"),
    }),
  },
  async (params) => {
    try {
      const result = await getPhotosByDateTool.handler(params);
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
  }
);

server.registerTool(
  getPhotosByLocationTool.name,
  {
    title: getPhotosByLocationTool.name,
    description: getPhotosByLocationTool.description,
    inputSchema: z.object({
      albumId: z.string().describe("Album ID"),
      userId: z.string().describe("User ID (for authorization)"),
      location: z.string().describe("Location name to filter photos"),
      limit: z.number().optional().default(50).describe("Max photos to return"),
    }),
  },
  async (params) => {
    try {
      const result = await getPhotosByLocationTool.handler(params);
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
  }
);

server.registerTool(
  getTripStatsTool.name,
  {
    title: getTripStatsTool.name,
    description: getTripStatsTool.description,
    inputSchema: z.object({
      albumId: z.string().describe("Album ID"),
      userId: z.string().describe("User ID (for authorization)"),
    }),
  },
  async (params) => {
    try {
      const result = await getTripStatsTool.handler(params);
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
  }
);

server.registerTool(
  getAlbumByNameTool.name,
  {
    title: getAlbumByNameTool.name,
    description: getAlbumByNameTool.description,
    inputSchema: z.object({
      userId: z.string().describe("User ID"),
      query: z.string().describe("Album name or title to search for"),
    }),
  },
  async (params) => {
    try {
      const result = await getAlbumByNameTool.handler(params);
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
  }
);

// Start server with stdio transport
async function main() {
  console.error("Starting Polotrip MCP Server...");
  console.error(`Environment: ${env.NODE_ENV || "development"}`);
  console.error(`Available tools: ${tools.length}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("MCP Server ready and listening on stdio");
  console.error(
    "Tools available:",
    [
      getUserAlbumsTool.name,
      getAlbumPhotosTool.name,
      getPhotosByDateTool.name,
      getPhotosByLocationTool.name,
      getTripStatsTool.name,
      getAlbumByNameTool.name,
    ].join(", ")
  );
}

main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
