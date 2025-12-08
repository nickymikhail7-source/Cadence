'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEmails } from '@/hooks/use-emails'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { EmptyState } from '@/components/states/empty-state'
import { SuccessState } from '@/components/states/success-state'
import { LoadingState } from '@/components/states/loading-state'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Avatar } from '@/components/ui/avatar'
import { HealthIndicator } from '@/components/ui/health-indicator'
import { ReplyComposer } from '@/components/email/reply-composer'

export default function FocusPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { emails, needsResponse, loading, error, fetchEmails, archiveEmail, syncEmails } = useEmails()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showReply, setShowReply] = useState(false)
    const [syncing, setSyncing] = useState(false)
    const [syncResult, setSyncResult] = useState<{ synced: number } | null>(null)

    const currentEmail = emails[currentIndex]

    // Initial fetch
    useEffect(() => {
        if (status === 'authenticated') {
            fetchEmails('needs_response')
        }
    }, [status, fetchEmails])

    // Navigation handlers
    const goNext = useCallback(() => {
        if (currentIndex < emails.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setShowReply(false)
        }
    }, [currentIndex, emails.length])

    const goPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setShowReply(false)
        }
    }, [currentIndex])

    const handleArchive = useCallback(async () => {
        if (!currentEmail) return
        await archiveEmail(currentEmail.id)
        // Auto-advance or go back if at end
        if (currentIndex >= emails.length - 1 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
        setShowReply(false)
    }, [currentEmail, archiveEmail, currentIndex, emails.length])

    const handleSync = useCallback(async () => {
        setSyncing(true)
        setSyncResult(null)
        try {
            const result = await syncEmails()
            setSyncResult(result)
        } catch {
            // Error handled by hook
        }
        setSyncing(false)
    }, [syncEmails])

    // Keyboard shortcuts
    useKeyboardShortcuts([
        { key: 'r', handler: () => setShowReply(true) },
        { key: 'e', handler: handleArchive },
        { key: 'ArrowRight', handler: goNext },
        { key: 'ArrowLeft', handler: goPrev },
        { key: 'Escape', handler: () => setShowReply(false) },
    ])

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    if (status === 'loading' || loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <LoadingState message={syncing ? 'Syncing emails...' : 'Loading emails...'} />
            </div>
        )
    }

    // All caught up!
    if (!loading && emails.length === 0 && needsResponse === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                {syncResult ? (
                    <SuccessState
                        title="All caught up!"
                        description={`Synced ${syncResult.synced} new emails`}
                    />
                ) : (
                    <EmptyState
                        icon={
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }
                        title="No emails to process"
                        description="Sync your Gmail to get started with Cadence."
                        action={
                            <Button onClick={handleSync} loading={syncing}>
                                {syncing ? 'Syncing...' : 'Sync emails'}
                            </Button>
                        }
                    />
                )}
            </div>
        )
    }

    if (!currentEmail) {
        return (
            <div className="h-full flex items-center justify-center">
                <SuccessState
                    title="All caught up!"
                    description="You've processed all emails that need attention."
                    stats={[
                        { label: 'Processed', value: emails.length },
                    ]}
                />
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            {/* Email Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-3xl mx-auto py-8 px-6">
                    {/* Sender Info */}
                    <div className="flex items-center gap-3 mb-6">
                        <Avatar name={currentEmail.contact?.name || currentEmail.fromName || currentEmail.fromEmail} size="lg" />
                        <div>
                            <h2 className="text-lg font-medium text-text-primary">
                                {currentEmail.contact?.name || currentEmail.fromName || currentEmail.fromEmail}
                            </h2>
                            <p className="text-sm text-text-tertiary">
                                {currentEmail.contact?.company || currentEmail.fromEmail}
                            </p>
                        </div>
                    </div>

                    {/* Subject */}
                    <h1 className="text-xl font-semibold text-text-primary mb-6">
                        {currentEmail.subject}
                    </h1>

                    {/* Email Body */}
                    <div className="text-text-primary text-base whitespace-pre-wrap leading-relaxed">
                        {currentEmail.body || currentEmail.snippet}
                    </div>
                </div>
            </div>

            {/* Reply Composer */}
            {showReply && (
                <div className="border-t border-border-subtle bg-bg-secondary">
                    <div className="max-w-3xl mx-auto py-4 px-6">
                        <ReplyComposer
                            emailId={currentEmail.id}
                            toEmail={currentEmail.fromEmail}
                            toName={currentEmail.contact?.name || currentEmail.fromName}
                            subject={currentEmail.subject}
                            onSent={() => {
                                setShowReply(false)
                                handleArchive()
                            }}
                            onCancel={() => setShowReply(false)}
                        />
                    </div>
                </div>
            )}

            {/* Relationship Bar */}
            {currentEmail.contact && (
                <div className="border-t border-border-subtle bg-bg-secondary px-6 py-3">
                    <div className="max-w-3xl mx-auto flex items-center gap-6">
                        <HealthIndicator score={currentEmail.contact.healthScore} showLabel />
                        <span className="text-sm text-text-tertiary">
                            {currentEmail.contact.totalEmails} emails
                        </span>
                        <span className="text-sm text-text-tertiary">
                            {currentEmail.contact.totalMeetings} meetings
                        </span>
                    </div>
                </div>
            )}

            {/* Action Bar */}
            <div className="border-t border-border-subtle bg-bg-primary px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button onClick={() => setShowReply(true)} disabled={showReply}>
                            Reply
                            <Kbd>R</Kbd>
                        </Button>
                        <Button variant="ghost" onClick={handleArchive}>
                            Archive
                            <Kbd>E</Kbd>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 text-text-tertiary">
                        <button
                            onClick={goPrev}
                            disabled={currentIndex === 0}
                            className="p-2 hover:bg-bg-hover rounded-md transition-colors disabled:opacity-30"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm">{currentIndex + 1} of {emails.length}</span>
                        <button
                            onClick={goNext}
                            disabled={currentIndex >= emails.length - 1}
                            className="p-2 hover:bg-bg-hover rounded-md transition-colors disabled:opacity-30"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
