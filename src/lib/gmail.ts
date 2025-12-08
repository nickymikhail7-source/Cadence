import { google } from 'googleapis'
import type { gmail_v1 } from 'googleapis'

// Create Gmail client with access token
export function getGmailClient(accessToken: string): gmail_v1.Gmail {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })
    return google.gmail({ version: 'v1', auth })
}

// Fetch emails from Gmail
export async function fetchEmails(
    gmail: gmail_v1.Gmail,
    options: {
        maxResults?: number
        query?: string
        pageToken?: string
    } = {}
): Promise<{
    emails: gmail_v1.Schema$Message[]
    nextPageToken?: string
}> {
    const { maxResults = 50, query = '', pageToken } = options

    const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults,
        q: query || 'in:inbox',
        pageToken,
    })

    const messageIds = response.data.messages || []

    // Fetch full message details in parallel
    const emails = await Promise.all(
        messageIds.map(async (msg) => {
            const detail = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id!,
                format: 'full',
            })
            return detail.data
        })
    )

    return {
        emails,
        nextPageToken: response.data.nextPageToken || undefined,
    }
}

// Get a single email by ID
export async function getEmail(
    gmail: gmail_v1.Gmail,
    emailId: string
): Promise<gmail_v1.Schema$Message> {
    const response = await gmail.users.messages.get({
        userId: 'me',
        id: emailId,
        format: 'full',
    })
    return response.data
}

// Parse email headers
export function parseEmailHeaders(headers: gmail_v1.Schema$MessagePartHeader[] = []): {
    from: string
    fromName: string | null
    to: string[]
    cc: string[]
    subject: string
    date: Date
} {
    const getHeader = (name: string) =>
        headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || ''

    const fromRaw = getHeader('From')
    const fromMatch = fromRaw.match(/^(?:"?(.+?)"?\s*)?<?([^<>]+@[^<>]+)>?$/)

    return {
        from: fromMatch?.[2] || fromRaw,
        fromName: fromMatch?.[1] || null,
        to: parseAddressList(getHeader('To')),
        cc: parseAddressList(getHeader('Cc')),
        subject: getHeader('Subject') || '(no subject)',
        date: new Date(getHeader('Date') || Date.now()),
    }
}

// Parse comma-separated email addresses
function parseAddressList(raw: string): string[] {
    if (!raw) return []
    return raw.split(',').map(addr => {
        const match = addr.match(/<([^>]+)>/)
        return (match?.[1] || addr).trim()
    }).filter(Boolean)
}

// Extract email body (plain text preferred)
export function extractEmailBody(payload: gmail_v1.Schema$MessagePart | undefined): {
    text: string | null
    html: string | null
} {
    if (!payload) return { text: null, html: null }

    let text: string | null = null
    let html: string | null = null

    function traverse(part: gmail_v1.Schema$MessagePart) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
            text = Buffer.from(part.body.data, 'base64').toString('utf-8')
        }
        if (part.mimeType === 'text/html' && part.body?.data) {
            html = Buffer.from(part.body.data, 'base64').toString('utf-8')
        }
        if (part.parts) {
            part.parts.forEach(traverse)
        }
    }

    traverse(payload)
    return { text, html }
}

// Archive an email (remove from inbox)
export async function archiveEmail(
    gmail: gmail_v1.Gmail,
    emailId: string
): Promise<void> {
    await gmail.users.messages.modify({
        userId: 'me',
        id: emailId,
        requestBody: {
            removeLabelIds: ['INBOX'],
        },
    })
}

// Send an email
export async function sendEmail(
    gmail: gmail_v1.Gmail,
    options: {
        to: string
        subject: string
        body: string
        threadId?: string
        inReplyTo?: string
    }
): Promise<string> {
    const { to, subject, body, threadId, inReplyTo } = options

    // Build email headers
    const headers = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
    ]

    if (inReplyTo) {
        headers.push(`In-Reply-To: ${inReplyTo}`)
        headers.push(`References: ${inReplyTo}`)
    }

    const emailContent = `${headers.join('\r\n')}\r\n\r\n${body}`
    const encodedEmail = Buffer.from(emailContent).toString('base64url')

    const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedEmail,
            threadId,
        },
    })

    return response.data.id!
}

// Get user's email profile
export async function getEmailProfile(gmail: gmail_v1.Gmail): Promise<{
    email: string
    name: string | null
}> {
    const response = await gmail.users.getProfile({ userId: 'me' })
    return {
        email: response.data.emailAddress!,
        name: null, // Profile doesn't include name
    }
}
