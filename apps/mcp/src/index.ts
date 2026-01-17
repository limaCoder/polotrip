/** biome-ignore-all lint/suspicious/noConsole: we are using console for logging */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { fastify } from "fastify";
import { env } from "./env";
import { tools } from "./tools/index";
import { registerAllTools } from "./tools/register";

const server = new McpServer({
  name: "polotrip-mcp",
  version: "1.0.0",
});

registerAllTools(server);

async function main() {
  console.error("Starting Polotrip MCP Server...");
  console.error(`Environment: ${env.NODE_ENV || "development"}`);
  console.error(`Available tools: ${tools.length}`);
  console.error(`Port: ${env.PORT}`);

  const app = fastify({
    logger: true,
  });

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });

  await server.connect(transport);

  app.all("/mcp", async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    reply.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Mcp-Session-Id"
    );

    if (request.method === "OPTIONS") {
      reply.code(200).send();
      return;
    }

    reply.hijack();

    await transport.handleRequest(
      request.raw,
      reply.raw,
      (request.body as unknown) ?? undefined
    );
  });

  app.get("/health", async () => {
    return { status: "ok", tools: tools.length };
  });

  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    console.error(
      `MCP Server ready and listening on http://localhost:${env.PORT}`
    );
    console.error("Tools available:", tools.map((t) => t.name).join(", "));
  } catch (error) {
    console.error("MCP HTTP server error:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
