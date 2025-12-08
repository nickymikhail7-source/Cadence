import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/meeting-types - List user's meeting types
export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const meetingTypes = await prisma.meetingType.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'asc' },
        })

        return NextResponse.json(meetingTypes)
    } catch (error) {
        console.error('Error fetching meeting types:', error)
        return NextResponse.json(
            { error: 'Failed to fetch meeting types' },
            { status: 500 }
        )
    }
}

// POST /api/meeting-types - Create meeting type
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            name,
            slug,
            description,
            duration,
            bufferBefore = 0,
            bufferAfter = 0,
            minNotice = 60,
            maxAdvance = 60,
            questions,
            locationType = 'VIDEO',
            locationValue,
        } = body

        if (!name || !slug || !duration) {
            return NextResponse.json(
                { error: 'Name, slug, and duration are required' },
                { status: 400 }
            )
        }

        // Check if slug already exists
        const existing = await prisma.meetingType.findUnique({
            where: { userId_slug: { userId: session.user.id, slug } },
        })

        if (existing) {
            return NextResponse.json(
                { error: 'A meeting type with this URL already exists' },
                { status: 400 }
            )
        }

        const meetingType = await prisma.meetingType.create({
            data: {
                userId: session.user.id,
                name,
                slug,
                description,
                duration,
                bufferBefore,
                bufferAfter,
                minNotice,
                maxAdvance,
                questions,
                locationType,
                locationValue,
                isActive: true,
            },
        })

        return NextResponse.json(meetingType)
    } catch (error) {
        console.error('Error creating meeting type:', error)
        return NextResponse.json(
            { error: 'Failed to create meeting type' },
            { status: 500 }
        )
    }
}
