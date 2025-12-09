import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        // 1. Security Check
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Verify API Key
        const apiKey = process.env.ANTHROPIC_API_KEY
        if (!apiKey) {
            console.error('ANTHROPIC_API_KEY is missing')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const { emailBody, senderName } = await request.json()

        if (!emailBody) {
            return NextResponse.json({ error: 'Email body is required' }, { status: 400 })
        }

        // 3. Initialize Anthropic
        const anthropic = new Anthropic({
            apiKey: apiKey,
        })

        // 4. Construct Prompt
        const prompt = `You are an executive assistant. Based on the email below from ${senderName || 'the sender'}, generate 3 short, distinct reply options (max 5 words each).
    
    Email Content:
    "${emailBody.substring(0, 1000)}" 
    
    Return ONLY a raw JSON array of strings, e.g. ["Option 1", "Option 2", "Option 3"]. Do not include any other text or markdown formatting.`

        // 5. Call Claude
        const message = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 150,
            temperature: 0.5,
            messages: [
                { role: 'user', content: prompt }
            ],
        })

        // 6. Parse Response
        const content = message.content[0].type === 'text' ? message.content[0].text : ''
        let suggestions: string[] = []

        try {
            // Clean up potential markdown code blocks if the model adds them
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim()
            suggestions = JSON.parse(cleanContent)
        } catch (e) {
            console.error('Failed to parse Claude response:', content)
            // Fallback
            suggestions = ['Sounds good', 'Can we reschedule?', 'Thanks for the update']
        }

        return NextResponse.json({ suggestions })

    } catch (error) {
        console.error('Suggestion generation failed:', error)
        return NextResponse.json(
            { error: 'Failed to generate suggestions' },
            { status: 500 }
        )
    }
}
