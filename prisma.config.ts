import { config } from "dotenv"
import { defineConfig } from "prisma/config"

// Load from .env.local first (Vercel env), then .env
config({ path: ".env.local" })
config({ path: ".env" })

const databaseUrl = process.env.DATABASE_URL
  ?? process.env.POSTGRES_URL
  ?? process.env.POSTGRES_PRISMA_URL
  ?? "postgresql://placeholder:placeholder@localhost:5432/cadence"

console.log("Using database:", databaseUrl.substring(0, 30) + "...")

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
})
