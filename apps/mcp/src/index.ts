import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { env } from './env.js'
import { tools } from './tools/index.js'

// Create MCP server
const server = new Server(
  {
    name: 'polotrip-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// Register tool list handler
server.setRequestHandler('tools/list', async () => {
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  }
})

// Register tool call handler
server.setRequestHandler('tools/call', async (request) => {
  const toolName = request.params.name
  const toolArgs = request.params.arguments

  const tool = tools.find((t) => t.name === toolName)

  if (!tool) {
    throw new Error(`Tool not found: ${toolName}`)
  }

  try {
    const result = await tool.handler(toolArgs)
    return result
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error)
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error:
              error instanceof Error ? error.message : 'Unknown error occurred',
          }),
        },
      ],
      isError: true,
    }
  }
})

// Start server with stdio transport
async function main() {
  console.error('Starting Polotrip MCP Server...')
  console.error(`Environment: ${env.NODE_ENV || 'development'}`)
  console.error(`Available tools: ${tools.length}`)

  const transport = new StdioServerTransport()
  await server.connect(transport)

  console.error('MCP Server ready and listening on stdio')
  console.error('Tools available:', tools.map((t) => t.name).join(', '))
}

main().catch((error) => {
  console.error('Fatal error starting MCP server:', error)
  process.exit(1)
})
