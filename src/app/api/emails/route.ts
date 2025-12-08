import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/emails - List emails
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const filter = searchParams.get('filter') as 'needs_response' | 'awaiting_reply' | 'all' | null
        const contactId = searchParams.get('contactId')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Build where clause
        const where: Record<string, unknown> = {
            userId: session.user.id,
            isArchived: false,
        }

        if (filter === 'needs_response') {
            where.category = 'NEEDS_RESPONSE'
        } else if (filter === 'awaiting_reply') {
            where.category = 'AWAITING_REPLY'
        }

        if (contactId) {
            where.contactId = contactId
        }

        // Fetch emails with contact info
        const [emails, total, needsResponse, awaitingReply] = await Promise.all([
            prisma.email.findMany({
                where,
                orderBy: { date: 'desc' },
                take: limit,
                skip: offset,
                include: {
                    contact: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            company: true,
                            healthScore: true,
                            totalEmails: true,
                            totalMeetings: true,
                        },
                    },
                },
            }),
            prisma.email.count({ where }),
            prisma.email.count({
                where: { ...where, category: 'NEEDS_RESPONSE' },
            }),
            prisma.email.count({
                where: { ...where, category: 'AWAITING_REPLY' },
            }),
        ])

        return NextResponse.json({
            emails,
            total,
            needsResponse,
            awaitingReply,
        })
    } catch (error) {
        console.error('Error fetching emails:', error)
        return NextResponse.json(
            { error: 'Failed to fetch emails' },
            { status: 500 }
        )
    }
}
