import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/meetings - List user's meetings
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const status = searchParams.get('status')
        const contactId = searchParams.get('contactId')

        // Build where clause
        const where: Record<string, unknown> = {
            userId: session.user.id,
        }

        if (startDate && endDate) {
            where.startTime = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            }
        }

        if (status) {
            where.status = status
        }

        if (contactId) {
            where.contactId = contactId
        }

        const meetings = await prisma.meeting.findMany({
            where,
            orderBy: { startTime: 'asc' },
            include: {
                contact: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        company: true,
                    },
                },
                meetingType: {
                    select: {
                        name: true,
                        duration: true,
                    },
                },
            },
        })

        return NextResponse.json(meetings)
    } catch (error) {
        console.error('Error fetching meetings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch meetings' },
            { status: 500 }
        )
    }
}

// POST /api/meetings - Create meeting manually
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            title,
            description,
            startTime,
            endTime,
            timezone = 'UTC',
            attendeeEmail,
            attendeeName,
            locationType = 'VIDEO',
            locationValue,
        } = body

        if (!title || !startTime || !endTime) {
            return NextResponse.json(
                { error: 'Title, start time, and end time are required' },
                { status: 400 }
            )
        }

        // Get or create contact if attendee provided
        let contactId: string | null = null
        if (attendeeEmail) {
            const { getOrCreateContact } = await import('@/lib/contacts')
            contactId = await getOrCreateContact(
                session.user.id,
                attendeeEmail,
                attendeeName
            )
        }

        const meeting = await prisma.meeting.create({
            data: {
                userId: session.user.id,
                contactId,
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                timezone,
                attendeeEmail,
                attendeeName,
                locationType,
                locationValue,
                status: 'SCHEDULED',
            },
        })

        return NextResponse.json(meeting)
    } catch (error) {
        console.error('Error creating meeting:', error)
        return NextResponse.json(
            { error: 'Failed to create meeting' },
            { status: 500 }
        )
    }
}
