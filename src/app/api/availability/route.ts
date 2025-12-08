import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createDefaultAvailability } from '@/lib/scheduling'

// GET /api/availability - Get user's availability
export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const availability = await prisma.availability.findMany({
            where: { userId: session.user.id },
            orderBy: { dayOfWeek: 'asc' },
        })

        // If no availability, create default
        if (availability.length === 0) {
            await createDefaultAvailability(session.user.id)
            const newAvailability = await prisma.availability.findMany({
                where: { userId: session.user.id },
                orderBy: { dayOfWeek: 'asc' },
            })
            return NextResponse.json(newAvailability)
        }

        return NextResponse.json(availability)
    } catch (error) {
        console.error('Error fetching availability:', error)
        return NextResponse.json(
            { error: 'Failed to fetch availability' },
            { status: 500 }
        )
    }
}

// PUT /api/availability - Update user's availability
export async function PUT(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { availability } = body as {
            availability: Array<{
                dayOfWeek: number
                startTime: number
                endTime: number
                isEnabled: boolean
            }>
        }

        // Delete existing availability
        await prisma.availability.deleteMany({
            where: { userId: session.user.id },
        })

        // Create new availability records
        for (const slot of availability) {
            await prisma.availability.create({
                data: {
                    userId: session.user.id,
                    dayOfWeek: slot.dayOfWeek,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isEnabled: slot.isEnabled,
                },
            })
        }

        // Fetch and return updated availability
        const updated = await prisma.availability.findMany({
            where: { userId: session.user.id },
            orderBy: { dayOfWeek: 'asc' },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Error updating availability:', error)
        return NextResponse.json(
            { error: 'Failed to update availability' },
            { status: 500 }
        )
    }
}
