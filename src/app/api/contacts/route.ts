import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/contacts - List contacts
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const filter = searchParams.get('filter') as 'at_risk' | 'healthy' | 'all' | null
        const type = searchParams.get('type')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Build where clause
        const where: Record<string, unknown> = {
            userId: session.user.id,
            status: 'ACTIVE',
        }

        if (filter === 'at_risk') {
            where.healthScore = { lt: 40 }
        } else if (filter === 'healthy') {
            where.healthScore = { gte: 70 }
        }

        if (type) {
            where.type = type
        }

        // Fetch contacts sorted by health score (weakest first)
        const [contacts, total, atRisk] = await Promise.all([
            prisma.contact.findMany({
                where,
                orderBy: { healthScore: 'asc' },
                take: limit,
                skip: offset,
            }),
            prisma.contact.count({ where }),
            prisma.contact.count({
                where: { ...where, healthScore: { lt: 40 } },
            }),
        ])

        return NextResponse.json({
            contacts,
            total,
            atRisk,
        })
    } catch (error) {
        console.error('Error fetching contacts:', error)
        return NextResponse.json(
            { error: 'Failed to fetch contacts' },
            { status: 500 }
        )
    }
}

// POST /api/contacts - Create contact
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { email, name, company, title, type } = body

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Check if contact exists
        const existing = await prisma.contact.findUnique({
            where: { userId_email: { userId: session.user.id, email } },
        })

        if (existing) {
            return NextResponse.json({ error: 'Contact already exists' }, { status: 400 })
        }

        const contact = await prisma.contact.create({
            data: {
                userId: session.user.id,
                email,
                name,
                company,
                title,
                type: type || 'UNKNOWN',
                healthScore: 50,
            },
        })

        return NextResponse.json(contact)
    } catch (error) {
        console.error('Error creating contact:', error)
        return NextResponse.json(
            { error: 'Failed to create contact' },
            { status: 500 }
        )
    }
}
