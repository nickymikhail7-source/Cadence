import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getGmailClient, sendEmail } from '@/lib/gmail'

// POST /api/emails/[id]/reply - Send reply to an email
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
        const body = await request.json()
        const { message } = body as { message: string }

        if (!message?.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // Get original email
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

        // Send reply via Gmail
        const gmail = getGmailClient(account.access_token)
        const sentId = await sendEmail(gmail, {
            to: email.fromEmail,
            subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
            body: message,
            threadId: email.threadId,
            inReplyTo: email.gmailId,
        })

        // Update original email category (no longer needs response)
        await prisma.email.update({
            where: { id },
            data: { category: 'AWAITING_REPLY' },
        })

        // Create interaction record
        if (email.contactId) {
            await prisma.interaction.create({
                data: {
                    contactId: email.contactId,
                    type: 'EMAIL_SENT',
                    direction: 'OUTBOUND',
                    summary: `Replied to: ${email.subject}`,
                    emailId: sentId,
                    occurredAt: new Date(),
                },
            })
        }

        return NextResponse.json({
            success: true,
            sentId,
        })
    } catch (error) {
        console.error('Error sending reply:', error)
        return NextResponse.json(
            { error: 'Failed to send reply' },
            { status: 500 }
        )
    }
}
