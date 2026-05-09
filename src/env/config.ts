import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  // JWT_SECRET: z.string(),
  // PORT: z.coerce.number().default(3333),
  POSTGRESQL_USERNAME: z.string(),
  POSTGRESQL_PASSWORD: z.string(),
  POSTGRESQL_DATABASE: z.string(),
  DATABASE_URL: z.string(),
  GOOGLE_MAPS_API_KEY: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables", z.treeifyError(_env.error));

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
