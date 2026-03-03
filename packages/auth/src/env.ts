import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  BETTER_AUTH_SECRET: z.string().min(1),

  AUTH_WEB_URL: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;
