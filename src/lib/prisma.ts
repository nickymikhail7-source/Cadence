import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
    const connectionString = process.env.POSTGRES_PRISMA_URL
        ?? process.env.DATABASE_URL
        ?? process.env.POSTGRES_URL

    if (!connectionString) {
        throw new Error('Database URL not configured. Please set POSTGRES_PRISMA_URL or DATABASE_URL.')
    }

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

// Lazy initialization to avoid build-time errors
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

// For backwards compatibility, but will throw during build if used at module level
export const prisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
        return getPrisma()[prop as keyof PrismaClient]
    }
})
