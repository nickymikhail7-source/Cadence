'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HybridComposer } from '@/components/email/hybrid-composer'
import { CheckCircle2, RotateCw, Mail } from 'lucide-react'

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

            // On success, refresh to load the next email
            router.refresh()

        } catch (error) {
            console.error('Send failed', error)
            alert('Failed to send reply.')
        } finally {
            setIsSending(false)
        }
    }

    // State A: Inbox Zero
    if (!email) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8 animate-fade-in-up">
                <div className="relative">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-2 shadow-sm border border-green-100">
                        <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                        <Mail size={18} className="text-gray-400" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">All Systems Operational</h2>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto text-base">
                        Zero Inbox achieved. No high-priority items pending.
                    </p>
                </div>

                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="group flex items-center gap-2.5 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700 shadow-sm hover:shadow-md"
                >
                    <RotateCw size={18} className={`text-gray-400 group-hover:text-blue-500 transition-colors ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Check for new emails'}</span>
                </button>
            </div>
        )
    }

    // State B: Active Focus
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Email Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-5">
                <div className="flex items-start justify-between border-b border-gray-100 pb-5">
                    <div className="space-y-1.5">
                        <h2 className="text-xl font-bold text-gray-900 leading-snug tracking-tight">
                            {email.subject}
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 uppercase shadow-sm">
                                {email.fromName?.[0] || email.fromEmail[0]}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 text-sm leading-none">
                                    {email.fromName || email.fromEmail}
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5 font-medium">
                                    {email.fromEmail}
                                </span>
                            </div>
                            <span className="text-gray-200 mx-1">|</span>
                            <span className="text-sm text-gray-400 font-medium">
                                {new Date(email.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="prose prose-sm text-gray-700 max-w-none">
                    <p className="leading-relaxed whitespace-pre-wrap text-[15px]">
                        {email.body || email.snippet || 'No content provided.'}
                    </p>
                </div>
            </div>

            {/* Reply Section */}
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        Draft Reply
                        <span className="text-[10px] font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100 tracking-wide uppercase">
                            AI & Voice Active
                        </span>
                    </h3>
                </div>

                <HybridComposer
                    senderName={email.fromName || 'the sender'}
                    onSend={handleSend}
                    initialText=""
                />
            </div>
        </div>
    )
}
