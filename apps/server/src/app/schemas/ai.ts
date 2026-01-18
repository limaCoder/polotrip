import z from "zod";

const uiMessagePartSchema = z.union([
  z.object({
    type: z.literal("text"),
    text: z.string(),
  }),
  z.object({
    type: z.string().startsWith("tool-"),
    state: z.enum(["input-available", "output-available"]),
    input: z.unknown().optional(),
    output: z.unknown().optional(),
  }),
  z.object({
    type: z.string(),
  }),
]);

const uiMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(uiMessagePartSchema).optional(),
  content: z.string().optional(),
});

export { uiMessagePartSchema, uiMessageSchema };
