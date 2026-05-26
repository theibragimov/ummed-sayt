import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// .env.local ni yuklash (Next.js style)
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] as string,
  },
});
