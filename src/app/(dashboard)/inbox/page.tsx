'use client'

import { EmptyState } from '@/components/states/empty-state'
import { Button } from '@/components/ui/button'

export default function InboxPage() {
    return (
        <div className="h-full p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-text-primary">Inbox</h1>
                    <Button>Sync emails</Button>
                </div>

                <EmptyState
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    }
                    title="No emails synced yet"
                    description="Connect your Gmail to start seeing your emails here."
                    action={<Button>Connect Gmail</Button>}
                />
            </div>
        </div>
    )
}
