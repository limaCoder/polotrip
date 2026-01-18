import type { z } from "zod";

export type MCPTool = {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (params: unknown) => Promise<{
    content: Array<{
      type: string;
      text: string;
    }>;
  }>;
};

export type RegisterableMcpTool = MCPTool & { zodInputSchema: z.ZodType };
