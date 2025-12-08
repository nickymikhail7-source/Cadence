'use client'

import { EmptyState } from '@/components/states/empty-state'
import { Button } from '@/components/ui/button'

export default function CalendarPage() {
    return (
        <div className="h-full p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-text-primary">Calendar</h1>
                    <Button>New meeting</Button>
                </div>

                <EmptyState
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                    title="No meetings scheduled"
                    description="Create a meeting or share your booking link to get started."
                    action={<Button>Create meeting</Button>}
                />
            </div>
        </div>
    )
}
