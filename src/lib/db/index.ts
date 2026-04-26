import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Don't throw at import time — let callers handle missing config.
  // This keeps `next build` working without a database.
  console.warn(
    "DATABASE_URL is not set. Database calls will fail at runtime."
  );
}

const sql = neon(
  connectionString ?? "postgresql://placeholder:placeholder@placeholder.neon.tech/placeholder"
);
export const db = drizzle(sql, { schema });
export { schema };
