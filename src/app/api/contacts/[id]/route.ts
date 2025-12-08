import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/contacts/[id] - Get contact with timeline
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

        const contact = await prisma.contact.findFirst({
            where: { id, userId: session.user.id },
            include: {
                interactions: {
                    orderBy: { occurredAt: 'desc' },
                    take: 20,
                },
                emails: {
                    orderBy: { date: 'desc' },
                    take: 10,
                    select: {
                        id: true,
                        subject: true,
                        snippet: true,
                        date: true,
                        direction: true,
                        category: true,
                    },
                },
                meetings: {
                    orderBy: { startTime: 'desc' },
                    take: 10,
                    select: {
                        id: true,
                        title: true,
                        startTime: true,
                        endTime: true,
                        status: true,
                    },
                },
            },
        })

        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
        }

        return NextResponse.json(contact)
    } catch (error) {
        console.error('Error fetching contact:', error)
        return NextResponse.json(
            { error: 'Failed to fetch contact' },
            { status: 500 }
        )
    }
}

// PATCH /api/contacts/[id] - Update contact
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
        const { name, company, title, type, status, notes, tags } = body

        // Verify ownership
        const existing = await prisma.contact.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
        }

        const contact = await prisma.contact.update({
            where: { id },
            data: {
                name,
                company,
                title,
                type,
                status,
                notes,
                tags,
            },
        })

        return NextResponse.json(contact)
    } catch (error) {
        console.error('Error updating contact:', error)
        return NextResponse.json(
            { error: 'Failed to update contact' },
            { status: 500 }
        )
    }
}

// DELETE /api/contacts/[id] - Archive contact
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
        const existing = await prisma.contact.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
        }

        // Soft delete (archive)
        await prisma.contact.update({
            where: { id },
            data: { status: 'ARCHIVED' },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting contact:', error)
        return NextResponse.json(
            { error: 'Failed to delete contact' },
            { status: 500 }
        )
    }
}
