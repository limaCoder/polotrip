export type MCPTool = {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, any>
    required?: string[]
  }
  handler: (params: unknown) => Promise<{
    content: Array<{
      type: string
      text: string
    }>
  }>
}
