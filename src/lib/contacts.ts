import { prisma } from '@/lib/prisma'
import { calculateHealthScore } from '@/lib/utils'

// Extract or create contact from email address
export async function getOrCreateContact(
    userId: string,
    email: string,
    name?: string | null
): Promise<string> {
    const existing = await prisma.contact.findUnique({
        where: { userId_email: { userId, email } },
    })

    if (existing) {
        // Update name if we have a better one
        if (name && !existing.name) {
            await prisma.contact.update({
                where: { id: existing.id },
                data: { name },
            })
        }
        return existing.id
    }

    // Create new contact
    const contact = await prisma.contact.create({
        data: {
            userId,
            email,
            name,
            healthScore: 50, // Default score
            firstContactAt: new Date(),
            lastContactAt: new Date(),
        },
    })

    return contact.id
}

// Update contact stats after syncing emails
export async function updateContactStats(contactId: string): Promise<void> {
    const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: {
            emails: {
                orderBy: { date: 'desc' },
                take: 1,
            },
            meetings: {
                where: { status: { in: ['SCHEDULED', 'CONFIRMED', 'COMPLETED'] } },
            },
            _count: {
                select: { emails: true, meetings: true },
            },
        },
    })

    if (!contact) return

    const lastEmail = contact.emails[0]
    const healthScore = calculateHealthScore({
        lastContactAt: lastEmail?.date || null,
        totalEmails: contact._count.emails,
        avgResponseTime: null, // TODO: Calculate from email pairs
    })

    await prisma.contact.update({
        where: { id: contactId },
        data: {
            healthScore,
            lastContactAt: lastEmail?.date,
            totalEmails: contact._count.emails,
            totalMeetings: contact._count.meetings,
        },
    })
}

// Categorize email based on content and direction
export function categorizeEmail(
    direction: 'INBOUND' | 'OUTBOUND',
    labels: string[]
): 'NEEDS_RESPONSE' | 'AWAITING_REPLY' | 'FYI' | 'MEETING_RELATED' | 'AUTOMATED' | 'OTHER' {
    // Check for meeting-related emails
    if (labels.some(l => l.includes('CATEGORY_UPDATES')) ||
        labels.some(l => l.includes('calendar'))) {
        return 'MEETING_RELATED'
    }

    // Check for automated emails
    if (labels.some(l => l.includes('CATEGORY_PROMOTIONS')) ||
        labels.some(l => l.includes('CATEGORY_SOCIAL'))) {
        return 'AUTOMATED'
    }

    // Based on direction
    if (direction === 'INBOUND') {
        return 'NEEDS_RESPONSE'
    } else {
        return 'AWAITING_REPLY'
    }
}

// Extract company from email domain
export function extractCompany(email: string): string | null {
    const domain = email.split('@')[1]
    if (!domain) return null

    // Skip common domains
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'me.com']
    if (commonDomains.includes(domain.toLowerCase())) {
        return null
    }

    // Extract company name from domain
    const parts = domain.split('.')
    if (parts.length >= 2) {
        // Capitalize first letter
        const name = parts[0]
        return name.charAt(0).toUpperCase() + name.slice(1)
    }

    return null
}
