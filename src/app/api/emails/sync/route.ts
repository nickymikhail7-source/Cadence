import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getGmailClient, fetchEmails, parseEmailHeaders, extractEmailBody } from '@/lib/gmail'
import { getOrCreateContact, updateContactStats, categorizeEmail, extractCompany } from '@/lib/contacts'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get valid access token (refreshes if needed)
        const { getValidAccessToken } = await import('@/lib/google')
        let accessToken: string
        try {
            accessToken = await getValidAccessToken(session.user.id)
        } catch (error) {
            console.error('Token error:', error)
            return NextResponse.json({ error: 'Authentication failed. Please reconnect Gmail.' }, { status: 401 })
        }

        const gmail = getGmailClient(accessToken)
        const userEmail = session.user.email!

        // Fetch recent emails
        const { emails: gmailMessages } = await fetchEmails(gmail, {
            maxResults: 100,
            query: 'in:inbox newer_than:7d',
        })

        let synced = 0
        let skipped = 0
        const contactsToUpdate = new Set<string>()

        for (const message of gmailMessages) {
            if (!message.id || !message.threadId) continue

            // Check if already synced
            const existing = await prisma.email.findUnique({
                where: { gmailId_userId: { gmailId: message.id, userId: session.user.id } },
            })

            if (existing) {
                skipped++
                continue
            }

            // Parse email
            const headers = parseEmailHeaders(message.payload?.headers)
            const { text, html } = extractEmailBody(message.payload)
            const labels = message.labelIds || []

            // Determine direction
            const isOutbound = headers.from.toLowerCase() === userEmail.toLowerCase()
            const direction = isOutbound ? 'OUTBOUND' : 'INBOUND'

            // Get counterpart email (the other person)
            const counterpartEmail = isOutbound ? headers.to[0] : headers.from
            const counterpartName = isOutbound ? null : headers.fromName

            // Skip if no valid counterpart
            if (!counterpartEmail) {
                skipped++
                continue
            }

            // Get or create contact
            const contactId = await getOrCreateContact(
                session.user.id,
                counterpartEmail,
                counterpartName
            )
            contactsToUpdate.add(contactId)

            // Update contact company if extracted
            const company = extractCompany(counterpartEmail)
            if (company) {
                await prisma.contact.update({
                    where: { id: contactId },
                    data: { company },
                })
            }

            // Categorize email
            const category = categorizeEmail(direction, labels)

            // Save email
            await prisma.email.create({
                data: {
                    userId: session.user.id,
                    contactId,
                    gmailId: message.id,
                    threadId: message.threadId,
                    fromEmail: headers.from,
                    fromName: headers.fromName,
                    toEmails: headers.to,
                    ccEmails: headers.cc,
                    subject: headers.subject,
                    snippet: message.snippet || null,
                    body: text,
                    bodyHtml: html,
                    date: headers.date,
                    isRead: !labels.includes('UNREAD'),
                    isStarred: labels.includes('STARRED'),
                    isArchived: !labels.includes('INBOX'),
                    labels,
                    direction,
                    category,
                    actionRequired: category === 'NEEDS_RESPONSE',
                },
            })

            synced++
        }

        // Update contact stats
        for (const contactId of contactsToUpdate) {
            await updateContactStats(contactId)
        }

        return NextResponse.json({
            success: true,
            synced,
            skipped,
            total: gmailMessages.length,
        })
    } catch (error) {
        console.error('Email sync error:', error)
        return NextResponse.json(
            { error: 'Failed to sync emails' },
            { status: 500 }
        )
    }
}
