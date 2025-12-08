import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getGmailClient, archiveEmail } from '@/lib/gmail'

// POST /api/emails/[id]/archive - Archive an email
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Get email
        const email = await prisma.email.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!email) {
            return NextResponse.json({ error: 'Email not found' }, { status: 404 })
        }

        // Get access token
        const account = await prisma.account.findFirst({
            where: { userId: session.user.id, provider: 'google' },
        })

        if (!account?.access_token) {
            return NextResponse.json({ error: 'No Google account linked' }, { status: 400 })
        }

        // Archive in Gmail
        const gmail = getGmailClient(account.access_token)
        await archiveEmail(gmail, email.gmailId)

        // Update local record
        await prisma.email.update({
            where: { id },
            data: {
                isArchived: true,
                category: 'OTHER', // No longer needs response
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error archiving email:', error)
        return NextResponse.json(
            { error: 'Failed to archive email' },
            { status: 500 }
        )
    }
}
