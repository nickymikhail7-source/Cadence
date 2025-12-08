'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

interface ReplyComposerProps {
    emailId: string
    toEmail: string
    toName?: string | null
    subject: string
    onSent: () => void
    onCancel: () => void
}

export function ReplyComposer({
    emailId,
    toEmail,
    toName,
    subject,
    onSent,
    onCancel,
}: ReplyComposerProps) {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSend = useCallback(async () => {
        if (!message.trim()) return

        setSending(true)
        setError(null)

        try {
            const response = await fetch(`/api/emails/${emailId}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })

            if (!response.ok) {
                throw new Error('Failed to send reply')
            }

            onSent()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send')
        } finally {
            setSending(false)
        }
    }, [emailId, message, onSent])

    const handleGenerateDraft = useCallback(async () => {
        setGenerating(true)
        setError(null)

        try {
            const response = await fetch('/api/ai/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailId }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate draft')
            }

            const data = await response.json()
            setMessage(data.draft)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate')
        } finally {
            setGenerating(false)
        }
    }, [emailId])

    // Keyboard shortcuts
    useKeyboardShortcuts([
        { key: 'Enter', metaKey: true, handler: handleSend },
    ])

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                    <span className="text-text-quaternary">To: </span>
                    {toName || toEmail}
                </div>
                <button
                    onClick={handleGenerateDraft}
                    disabled={generating}
                    className="text-sm text-accent hover:text-accent-hover transition-colors disabled:opacity-50"
                >
                    {generating ? 'Generating...' : 'AI Draft'}
                </button>
            </div>

            {/* Subject */}
            <div className="text-sm text-text-tertiary">
                <span className="text-text-quaternary">Subject: </span>
                {subject.startsWith('Re:') ? subject : `Re: ${subject}`}
            </div>

            {/* Message Input */}
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your reply..."
                className="w-full h-32 px-3 py-2 bg-bg-primary border border-border-subtle rounded-lg
          text-text-primary placeholder:text-text-quaternary
          focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
          resize-none"
                autoFocus
            />

            {/* Error */}
            {error && (
                <p className="text-sm text-danger">{error}</p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button onClick={handleSend} loading={sending} disabled={!message.trim()}>
                        Send
                        <Kbd>⌘↵</Kbd>
                    </Button>
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                        <Kbd>Esc</Kbd>
                    </Button>
                </div>

                <span className="text-xs text-text-quaternary">
                    Tab for AI autocomplete
                </span>
            </div>
        </div>
    )
}
