import "dotenv/config"
import { defineConfig } from "prisma/config"

const databaseUrl = process.env.POSTGRES_PRISMA_URL
  ?? process.env.DATABASE_URL
  ?? "postgresql://placeholder:placeholder@localhost:5432/cadence"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
})
