import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

// Summarize an email
export async function summarizeEmail(content: string): Promise<string> {
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        messages: [
            {
                role: 'user',
                content: `Summarize this email in 1-2 sentences, focusing on the key ask or update:\n\n${content}`,
            },
        ],
    })

    const textBlock = response.content.find(block => block.type === 'text')
    return textBlock?.text || 'Unable to summarize'
}

// Detect sentiment of an email
export async function analyzeSentiment(
    content: string
): Promise<'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'URGENT'> {
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [
            {
                role: 'user',
                content: `Analyze the sentiment of this email. Reply with exactly one word: POSITIVE, NEUTRAL, NEGATIVE, or URGENT.\n\n${content}`,
            },
        ],
    })

    const textBlock = response.content.find(block => block.type === 'text')
    const sentiment = textBlock?.text?.trim().toUpperCase()

    if (['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'URGENT'].includes(sentiment || '')) {
        return sentiment as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'URGENT'
    }
    return 'NEUTRAL'
}

// Generate a reply draft
export async function generateReplyDraft(
    originalEmail: string,
    context: {
        senderName: string
        relationshipNotes?: string
        instruction?: string
    }
): Promise<string> {
    const systemPrompt = `You are a professional email writer. Write concise, friendly, and professional email replies.
${context.relationshipNotes ? `Context about the relationship: ${context.relationshipNotes}` : ''}
${context.instruction ? `Additional instruction: ${context.instruction}` : ''}
Keep the reply brief and actionable. Don't include a subject line.`

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
            {
                role: 'user',
                content: `Write a reply to this email from ${context.senderName}:\n\n${originalEmail}`,
            },
        ],
    })

    const textBlock = response.content.find(block => block.type === 'text')
    return textBlock?.text || ''
}

// Detect if action is required
export async function detectActionRequired(content: string): Promise<boolean> {
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 5,
        messages: [
            {
                role: 'user',
                content: `Does this email require a response or action from the recipient? Reply with exactly "YES" or "NO".\n\n${content}`,
            },
        ],
    })

    const textBlock = response.content.find(block => block.type === 'text')
    return textBlock?.text?.trim().toUpperCase() === 'YES'
}

// Generate meeting prep summary
export async function generateMeetingPrep(
    context: {
        contactName: string
        contactCompany?: string
        recentEmails: string[]
        meetingTitle: string
    }
): Promise<string> {
    const emailContext = context.recentEmails.length > 0
        ? `Recent email exchanges:\n${context.recentEmails.join('\n\n---\n\n')}`
        : 'No recent email history.'

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [
            {
                role: 'user',
                content: `Prepare a brief meeting prep summary for my upcoming meeting "${context.meetingTitle}" with ${context.contactName}${context.contactCompany ? ` from ${context.contactCompany}` : ''}.

${emailContext}

Provide:
1. Key topics to discuss
2. Any open items or follow-ups
3. Suggested questions`,
            },
        ],
    })

    const textBlock = response.content.find(block => block.type === 'text')
    return textBlock?.text || ''
}
