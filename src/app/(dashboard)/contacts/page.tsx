'use client'

import { EmptyState } from '@/components/states/empty-state'
import { Button } from '@/components/ui/button'

export default function ContactsPage() {
    return (
        <div className="h-full p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-text-primary">Contacts</h1>
                </div>

                <EmptyState
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    }
                    title="No contacts yet"
                    description="Contacts will appear here as you sync your emails."
                    action={<Button>Sync emails</Button>}
                />
            </div>
        </div>
    )
}
