import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
    // Use DATABASE_URL from Vercel Postgres
    const connectionString = process.env.DATABASE_URL
        ?? process.env.POSTGRES_URL
        ?? process.env.POSTGRES_PRISMA_URL

    if (!connectionString) {
        throw new Error('Database URL not configured. Set DATABASE_URL environment variable.')
    }

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

// Lazy initialization for build safety
let _prisma: PrismaClient | null = null

export function getPrisma(): PrismaClient {
    if (!_prisma) {
        _prisma = globalForPrisma.prisma ?? createPrismaClient()
        if (process.env.NODE_ENV !== 'production') {
            globalForPrisma.prisma = _prisma
        }
    }
    return _prisma
}

// Proxy for backwards compatibility
export const prisma = new Proxy({} as PrismaClient, {
    get(_, prop) {
        return getPrisma()[prop as keyof PrismaClient]
    }
})
