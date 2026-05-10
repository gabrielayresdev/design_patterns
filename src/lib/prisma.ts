import { env } from "@/env/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = new URL(env.DATABASE_URL!);
const schema = databaseUrl.searchParams.get("schema") ?? undefined;

const adapter = new PrismaPg(
  { connectionString: env.DATABASE_URL! },
  schema ? { schema } : undefined,
);

export const prisma = new PrismaClient({
  adapter,
});
