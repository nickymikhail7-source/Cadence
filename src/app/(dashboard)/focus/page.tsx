'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/states/empty-state'
import { SuccessState } from '@/components/states/success-state'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Avatar } from '@/components/ui/avatar'
import { HealthIndicator } from '@/components/ui/health-indicator'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

// Placeholder data for demo
const demoEmail = {
    id: '1',
    fromName: 'Sarah Chen',
    fromEmail: 'sarah@sequoiacap.com',
    subject: 'Re: Series A Meeting',
    body: `Hi Nikhil,

Tuesday at 3pm works great for me! I'll send over a calendar invite.

Looking forward to discussing next steps.

Best,
Sarah`,
    date: new Date(),
    contact: {
        name: 'Sarah Chen',
        company: 'Sequoia Capital',
        healthScore: 82,
        totalEmails: 23,
        totalMeetings: 4,
        avgResponseTime: '4h',
    }
}

export default function FocusPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    // Demo state - in real app this would come from API
    const hasEmails = true
    const currentEmail = demoEmail
    const allCaughtUp = false

    // Keyboard shortcuts for focus view
    useKeyboardShortcuts([
        { key: 'r', handler: () => console.log('Reply') },
        { key: 's', handler: () => console.log('Schedule') },
        { key: 'e', handler: () => console.log('Archive') },
        { key: 'ArrowRight', handler: () => console.log('Next') },
        { key: 'ArrowLeft', handler: () => console.log('Previous') },
    ])

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-border-default border-t-accent rounded-full animate-spin" />
            </div>
        )
    }

    if (allCaughtUp) {
        return (
            <div className="h-full flex items-center justify-center">
                <SuccessState
                    stats={[
                        { label: 'Processed today', value: 12 },
                        { label: 'Avg response', value: '2h' },
                    ]}
                />
            </div>
        )
    }

    if (!hasEmails) {
        return (
            <div className="h-full flex items-center justify-center">
                <EmptyState
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    }
                    title="No emails to process"
                    description="Sync your Gmail to get started with Cadence."
                    action={<Button>Sync emails</Button>}
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
                        <Avatar name={currentEmail.contact.name} size="lg" />
                        <div>
                            <h2 className="text-lg font-medium text-text-primary">
                                {currentEmail.contact.name}
                            </h2>
                            <p className="text-sm text-text-tertiary">
                                {currentEmail.contact.company}
                            </p>
                        </div>
                    </div>

                    {/* Subject */}
                    <h1 className="text-xl font-semibold text-text-primary mb-6">
                        {currentEmail.subject}
                    </h1>

                    {/* Email Body */}
                    <div className="text-text-primary text-base whitespace-pre-wrap leading-relaxed">
                        {currentEmail.body}
                    </div>
                </div>
            </div>

            {/* Relationship Bar */}
            <div className="border-t border-border-subtle bg-bg-secondary px-6 py-3">
                <div className="max-w-3xl mx-auto flex items-center gap-6">
                    <HealthIndicator score={currentEmail.contact.healthScore} showLabel />
                    <span className="text-sm text-text-tertiary">
                        {currentEmail.contact.totalEmails} emails
                    </span>
                    <span className="text-sm text-text-tertiary">
                        {currentEmail.contact.totalMeetings} meetings
                    </span>
                    <span className="text-sm text-text-tertiary">
                        Avg: {currentEmail.contact.avgResponseTime}
                    </span>
                </div>
            </div>

            {/* Action Bar */}
            <div className="border-t border-border-subtle bg-bg-primary px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button>
                            Reply
                            <Kbd>R</Kbd>
                        </Button>
                        <Button variant="secondary">
                            Schedule
                            <Kbd>S</Kbd>
                        </Button>
                        <Button variant="ghost">
                            Archive
                            <Kbd>E</Kbd>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 text-text-tertiary">
                        <button className="p-2 hover:bg-bg-hover rounded-md transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm">1 of 3</span>
                        <button className="p-2 hover:bg-bg-hover rounded-md transition-colors">
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
