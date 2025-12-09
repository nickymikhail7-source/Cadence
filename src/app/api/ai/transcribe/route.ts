import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
    // 1. Security Check
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify API Key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
        console.error('OPENAI_API_KEY is missing')
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    let tempFilePath = ''

    try {
        // 3. Parse Form Data
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // 4. Write to Temp File (as requested)
        const buffer = Buffer.from(await file.arrayBuffer())
        const tempDir = os.tmpdir()
        const fileName = `upload_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`
        tempFilePath = path.join(tempDir, fileName)

        fs.writeFileSync(tempFilePath, buffer)

        // 5. Prepare OpenAI Request
        // We read the file back to ensure we use the fs path as the source of truth
        const fileData = fs.readFileSync(tempFilePath)
        const blob = new Blob([fileData], { type: file.type || 'audio/mpeg' })

        const openAIFormData = new FormData()
        openAIFormData.append('file', blob, 'audio.mp3')
        openAIFormData.append('model', 'whisper-1')

        // 6. Call OpenAI Whisper API
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: openAIFormData,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('OpenAI Transcription Error:', errorText)
            throw new Error(`OpenAI API error: ${response.statusText}`)
        }

        const data = await response.json()

        // 7. Return Result
        return NextResponse.json({ text: data.text })

    } catch (error) {
        console.error('Transcription failed:', error)
        return NextResponse.json(
            { error: 'Transcription failed' },
            { status: 500 }
        )
    } finally {
        // 8. Cleanup Temp File
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath)
            } catch (cleanupError) {
                console.error('Failed to delete temp file:', cleanupError)
            }
        }
    }
}
