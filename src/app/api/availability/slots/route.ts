import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAvailableSlots } from '@/lib/scheduling'

// GET /api/availability/slots - Get available booking slots (public)
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const username = searchParams.get('username')
        const meetingTypeSlug = searchParams.get('slug')
        const startDateStr = searchParams.get('startDate')
        const endDateStr = searchParams.get('endDate')
        const timezone = searchParams.get('timezone') || 'UTC'

        if (!username || !meetingTypeSlug || !startDateStr || !endDateStr) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            )
        }

        // Find user by email (username is email for now)
        const user = await prisma.user.findUnique({
            where: { email: username },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Find meeting type
        const meetingType = await prisma.meetingType.findUnique({
            where: { userId_slug: { userId: user.id, slug: meetingTypeSlug } },
        })

        if (!meetingType || !meetingType.isActive) {
            return NextResponse.json(
                { error: 'Meeting type not found' },
                { status: 404 }
            )
        }

        // Get available slots
        const startDate = new Date(startDateStr)
        const endDate = new Date(endDateStr)

        const slots = await getAvailableSlots({
            userId: user.id,
            meetingTypeId: meetingType.id,
            startDate,
            endDate,
            timezone,
        })

        return NextResponse.json({
            slots: slots.map(s => ({
                start: s.start.toISOString(),
                end: s.end.toISOString(),
            })),
            meetingType: {
                name: meetingType.name,
                duration: meetingType.duration,
                description: meetingType.description,
                questions: meetingType.questions,
            },
        })
    } catch (error) {
        console.error('Error fetching slots:', error)
        return NextResponse.json(
            { error: 'Failed to fetch available slots' },
            { status: 500 }
        )
    }
}
