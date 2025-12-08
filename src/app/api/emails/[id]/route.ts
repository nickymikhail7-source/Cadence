import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/emails/[id] - Get single email
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const email = await prisma.email.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
            include: {
                contact: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        company: true,
                        title: true,
                        healthScore: true,
                        totalEmails: true,
                        totalMeetings: true,
                        avgResponseTime: true,
                        lastContactAt: true,
                    },
                },
            },
        })

        if (!email) {
            return NextResponse.json({ error: 'Email not found' }, { status: 404 })
        }

        return NextResponse.json(email)
    } catch (error) {
        console.error('Error fetching email:', error)
        return NextResponse.json(
            { error: 'Failed to fetch email' },
            { status: 500 }
        )
    }
}
