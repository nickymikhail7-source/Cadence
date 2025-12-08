import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/meeting-types/[id] - Get meeting type
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

        const meetingType = await prisma.meetingType.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!meetingType) {
            return NextResponse.json(
                { error: 'Meeting type not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(meetingType)
    } catch (error) {
        console.error('Error fetching meeting type:', error)
        return NextResponse.json(
            { error: 'Failed to fetch meeting type' },
            { status: 500 }
        )
    }
}

// PATCH /api/meeting-types/[id] - Update meeting type
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

        // Verify ownership
        const existing = await prisma.meetingType.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!existing) {
            return NextResponse.json(
                { error: 'Meeting type not found' },
                { status: 404 }
            )
        }

        const meetingType = await prisma.meetingType.update({
            where: { id },
            data: body,
        })

        return NextResponse.json(meetingType)
    } catch (error) {
        console.error('Error updating meeting type:', error)
        return NextResponse.json(
            { error: 'Failed to update meeting type' },
            { status: 500 }
        )
    }
}

// DELETE /api/meeting-types/[id] - Delete meeting type
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

        // Verify ownership
        const existing = await prisma.meetingType.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!existing) {
            return NextResponse.json(
                { error: 'Meeting type not found' },
                { status: 404 }
            )
        }

        await prisma.meetingType.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting meeting type:', error)
        return NextResponse.json(
            { error: 'Failed to delete meeting type' },
            { status: 500 }
        )
    }
}
