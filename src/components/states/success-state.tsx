'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface SuccessStateProps {
    title?: string
    description?: string
    stats?: {
        label: string
        value: string | number
    }[]
    className?: string
}

export function SuccessState({
    title = "All caught up!",
    description = "You've processed all emails that need attention.",
    stats,
    className
}: SuccessStateProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(true)
    }, [])

    return (
        <div className={cn(
            'flex flex-col items-center justify-center py-16 px-4',
            'transition-all duration-300',
            show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
            className
        )}>
            {/* Animated checkmark */}
            <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mb-6">
                <svg
                    className="w-8 h-8 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                        className={cn(
                            'transition-all duration-500 delay-200',
                            show ? 'stroke-dashoffset-0' : ''
                        )}
                        style={{
                            strokeDasharray: 24,
                            strokeDashoffset: show ? 0 : 24,
                            transition: 'stroke-dashoffset 0.5s ease-out 0.2s'
                        }}
                    />
                </svg>
            </div>

            <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
            <p className="text-sm text-text-tertiary text-center max-w-sm mb-6">{description}</p>

            {stats && stats.length > 0 && (
                <div className="flex items-center gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
                            <p className="text-xs text-text-tertiary">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
