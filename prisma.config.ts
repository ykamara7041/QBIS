import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUrl =
  process.env["POSTGRES_URL_NON_POOLING"] ||
  process.env["DATABASE_URL"] ||
  process.env["POSTGRES_URL"] ||
  "postgres://dummy:dummy@localhost:5432/dummy";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
});
