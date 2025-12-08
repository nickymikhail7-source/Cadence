import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateReplyDraft } from '@/lib/anthropic'

// POST /api/ai/draft - Generate reply draft
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { emailId, instruction } = body as { emailId: string; instruction?: string }

        if (!emailId) {
            return NextResponse.json({ error: 'Email ID is required' }, { status: 400 })
        }

        // Get email with contact info
        const email = await prisma.email.findFirst({
            where: { id: emailId, userId: session.user.id },
            include: {
                contact: {
                    select: {
                        name: true,
                        notes: true,
                    },
                },
            },
        })

        if (!email) {
            return NextResponse.json({ error: 'Email not found' }, { status: 404 })
        }

        // Generate draft
        const draft = await generateReplyDraft(
            email.body || email.snippet || '',
            {
                senderName: email.contact?.name || email.fromName || email.fromEmail,
                relationshipNotes: email.contact?.notes || undefined,
                instruction,
            }
        )

        return NextResponse.json({
            draft,
            suggestedSubject: email.subject.startsWith('Re:')
                ? email.subject
                : `Re: ${email.subject}`,
        })
    } catch (error) {
        console.error('Error generating draft:', error)
        return NextResponse.json(
            { error: 'Failed to generate draft' },
            { status: 500 }
        )
    }
}
