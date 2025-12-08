'use client'

import { Button } from '@/components/ui/button'

// Demo meeting types
const demoMeetingTypes = [
    {
        id: '1',
        name: 'Quick Chat',
        slug: 'quick-chat',
        duration: 15,
        description: 'A brief 15-minute call to connect',
        isActive: true,
    },
    {
        id: '2',
        name: 'Discovery Call',
        slug: 'discovery',
        duration: 30,
        description: 'Let\'s explore how we can work together',
        isActive: true,
    },
    {
        id: '3',
        name: 'Deep Dive',
        slug: 'deep-dive',
        duration: 60,
        description: 'An in-depth discussion session',
        isActive: false,
    },
]

export default function SchedulingPage() {
    return (
        <div className="h-full p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">Scheduling</h1>
                        <p className="text-sm text-text-tertiary mt-1">
                            Manage your booking links and availability
                        </p>
                    </div>
                    <Button>New meeting type</Button>
                </div>

                {/* Booking Link */}
                <div className="bg-accent-light border border-accent-subtle rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-accent">Your booking page</p>
                            <p className="text-sm text-text-secondary mt-0.5">
                                cadence.app/meet/your-username
                            </p>
                        </div>
                        <Button variant="secondary" size="sm">
                            Copy link
                        </Button>
                    </div>
                </div>

                {/* Meeting Types */}
                <div className="space-y-3">
                    {demoMeetingTypes.map((type) => (
                        <div
                            key={type.id}
                            className="bg-bg-primary border border-border-subtle rounded-lg p-4 hover:border-border-default transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-medium text-text-primary">
                                            {type.name}
                                        </h3>
                                        {!type.isActive && (
                                            <span className="text-xs px-2 py-0.5 bg-bg-tertiary text-text-tertiary rounded">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-tertiary mt-1">
                                        {type.duration} min · {type.description}
                                    </p>
                                    <p className="text-xs text-text-quaternary mt-2">
                                        cadence.app/meet/your-username/{type.slug}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm">
                                        Copy
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Availability Settings */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-text-primary mb-4">Availability</h2>
                    <div className="bg-bg-primary border border-border-subtle rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-primary">Working hours</p>
                                <p className="text-sm text-text-tertiary mt-0.5">
                                    Mon-Fri, 9:00 AM - 5:00 PM
                                </p>
                            </div>
                            <Button variant="secondary" size="sm">
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
