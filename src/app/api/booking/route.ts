import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateContact } from '@/lib/contacts'

// POST /api/booking - Create a booking (public, no auth required)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            meetingTypeId,
            startTime,
            timezone,
            attendee,
            answers,
        } = body as {
            meetingTypeId: string
            startTime: string
            timezone: string
            attendee: { name: string; email: string }
            answers?: Record<string, string>
        }

        // Validate required fields
        if (!meetingTypeId || !startTime || !attendee?.name || !attendee?.email) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Get meeting type with user
        const meetingType = await prisma.meetingType.findUnique({
            where: { id: meetingTypeId },
            include: {
                user: {
                    select: { id: true, email: true, name: true },
                },
            },
        })

        if (!meetingType || !meetingType.isActive) {
            return NextResponse.json(
                { error: 'Meeting type not found or inactive' },
                { status: 404 }
            )
        }

        // Calculate end time
        const start = new Date(startTime)
        const end = new Date(start.getTime() + meetingType.duration * 60 * 1000)

        // Check for conflicts
        const existingMeeting = await prisma.meeting.findFirst({
            where: {
                userId: meetingType.userId,
                status: { in: ['SCHEDULED', 'CONFIRMED'] },
                OR: [
                    {
                        startTime: { lte: start },
                        endTime: { gt: start },
                    },
                    {
                        startTime: { lt: end },
                        endTime: { gte: end },
                    },
                    {
                        startTime: { gte: start },
                        endTime: { lte: end },
                    },
                ],
            },
        })

        if (existingMeeting) {
            return NextResponse.json(
                { error: 'This time slot is no longer available' },
                { status: 409 }
            )
        }

        // Get or create contact
        const contactId = await getOrCreateContact(
            meetingType.userId,
            attendee.email,
            attendee.name
        )

        // Generate a simple meeting link (placeholder)
        const meetingLink = meetingType.locationType === 'VIDEO'
            ? `https://meet.cadence.app/${meetingType.id}/${Date.now()}`
            : meetingType.locationValue

        // Create meeting
        const meeting = await prisma.meeting.create({
            data: {
                userId: meetingType.userId,
                contactId,
                meetingTypeId: meetingType.id,
                title: `${meetingType.name} with ${attendee.name}`,
                description: meetingType.description,
                startTime: start,
                endTime: end,
                timezone,
                locationType: meetingType.locationType,
                locationValue: meetingType.locationValue,
                meetingLink,
                attendeeEmail: attendee.email,
                attendeeName: attendee.name,
                bookedAt: new Date(),
                bookingAnswers: answers || {},
                status: meetingType.requiresConfirmation ? 'SCHEDULED' : 'CONFIRMED',
            },
        })

        // Create interaction record
        await prisma.interaction.create({
            data: {
                contactId,
                type: 'MEETING_SCHEDULED',
                direction: 'INBOUND',
                summary: `Booked: ${meetingType.name}`,
                meetingId: meeting.id,
                occurredAt: new Date(),
            },
        })

        // TODO: Send confirmation emails

        return NextResponse.json({
            success: true,
            meeting: {
                id: meeting.id,
                title: meeting.title,
                startTime: meeting.startTime,
                endTime: meeting.endTime,
                meetingLink: meeting.meetingLink,
            },
        })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        )
    }
}
