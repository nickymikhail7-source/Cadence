'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HybridComposer } from '@/components/email/hybrid-composer'
import { CheckCircle2, RotateCw } from 'lucide-react'

// Define the Email interface based on Prisma model
interface Email {
    id: string
    subject: string
    fromName: string | null
    fromEmail: string
    body: string | null
    snippet: string | null
    date: Date
}

interface FocusViewProps {
    email?: Email | null
}

export function FocusView({ email }: FocusViewProps) {
    const router = useRouter()
    const [isSyncing, setIsSyncing] = useState(false)
    const [isSending, setIsSending] = useState(false)

    const handleSync = async () => {
        setIsSyncing(true)
        try {
            await fetch('/api/emails/sync', { method: 'POST' })
            router.refresh()
        } catch (error) {
            console.error('Sync failed', error)
            alert('Failed to sync emails.')
        } finally {
            setIsSyncing(false)
        }
    }

    const handleSend = async (text: string) => {
        if (!email) return
        setIsSending(true)
        try {
            const res = await fetch(`/api/emails/${email.id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body: text })
            })

            if (!res.ok) throw new Error('Failed to send')

            // Refresh to load next email (which effectively archives the current one if your API handles it, 
            // otherwise we might need an explicit archive step or the user workflow logic implies resolved)
            // *Note: The prompt says "On success, router.refresh() to load the next email". 
            // Assuming the reply API or logic handles moving it out of focus, or the next fetch will exclude it.
            // If not, we might see the same email. But let's follow the prompt.*
            router.refresh()

        } catch (error) {
            console.error('Send failed', error)
            alert('Failed to send reply.')
        } finally {
            setIsSending(false)
        }
    }

    // 1. Scenario A: No Email (Zero Inbox)
    if (!email) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6 animate-fade-in-up">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">All systems operational</h2>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        You've reached Zero Inbox. No pending high-priority items contenting for your attention.
                    </p>
                </div>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700 shadow-sm"
                >
                    <RotateCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
            </div>
        )
    }

    // 2. Scenario B: Active Email
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Email Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
                <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 leading-tight">{email.subject}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 uppercase">
                                {email.fromName?.[0] || email.fromEmail[0]}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900 text-sm leading-none">
                                    {email.fromName || email.fromEmail}
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5">
                                    {email.fromEmail}
                                </span>
                            </div>
                            <span className="text-gray-300 mx-1">•</span>
                            <span className="text-sm text-gray-500">
                                {new Date(email.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="prose prose-sm text-gray-700 max-w-none">
                    <p className="leading-relaxed whitespace-pre-wrap">
                        {email.body || email.snippet || 'No content'}
                    </p>
                </div>
            </div>

            {/* Reply Section */}
            <div className="pt-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 ml-1 flex items-center gap-2">
                    Draft Reply
                    <span className="text-xs font-normal text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">Voice Enabled</span>
                </h3>
                <HybridComposer
                    senderName={email.fromName || 'the sender'}
                    onSend={handleSend}
                    initialText=""
                />
            </div>
        </div>
    )
}
