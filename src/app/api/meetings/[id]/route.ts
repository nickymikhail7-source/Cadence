import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/meetings/[id] - Get meeting details
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

        const meeting = await prisma.meeting.findFirst({
            where: { id, userId: session.user.id },
            include: {
                contact: true,
                meetingType: true,
            },
        })

        if (!meeting) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
        }

        return NextResponse.json(meeting)
    } catch (error) {
        console.error('Error fetching meeting:', error)
        return NextResponse.json(
            { error: 'Failed to fetch meeting' },
            { status: 500 }
        )
    }
}

// PATCH /api/meetings/[id] - Update meeting
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()

        const existing = await prisma.meeting.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
        }

        const meeting = await prisma.meeting.update({
            where: { id },
            data: body,
        })

        return NextResponse.json(meeting)
    } catch (error) {
        console.error('Error updating meeting:', error)
        return NextResponse.json(
            { error: 'Failed to update meeting' },
            { status: 500 }
        )
    }
}

// DELETE /api/meetings/[id] - Cancel/delete meeting
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const existing = await prisma.meeting.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
        }

        // Cancel rather than delete
        await prisma.meeting.update({
            where: { id },
            data: { status: 'CANCELLED' },
        })

        // Create interaction if has contact
        if (existing.contactId) {
            await prisma.interaction.create({
                data: {
                    contactId: existing.contactId,
                    type: 'MEETING_CANCELLED',
                    direction: 'OUTBOUND',
                    summary: `Cancelled: ${existing.title}`,
                    meetingId: existing.id,
                    occurredAt: new Date(),
                },
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error cancelling meeting:', error)
        return NextResponse.json(
            { error: 'Failed to cancel meeting' },
            { status: 500 }
        )
    }
}
