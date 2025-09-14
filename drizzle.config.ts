import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/db/schema.ts",
  out: "./drizzle/db",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },} satisfies Config;
