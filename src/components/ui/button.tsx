'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-fast',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    // Variants
                    variant === 'primary' && 'bg-accent text-white hover:bg-accent-hover active:bg-accent-hover',
                    variant === 'secondary' && 'bg-bg-primary text-text-primary border border-border-default hover:bg-bg-hover active:bg-bg-tertiary',
                    variant === 'ghost' && 'bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary active:bg-bg-tertiary',
                    variant === 'danger' && 'bg-danger text-white hover:bg-red-700 active:bg-red-800',
                    // Sizes
                    size === 'sm' && 'px-2 py-1 text-sm h-7',
                    size === 'md' && 'px-3 py-1.5 text-sm h-8',
                    size === 'lg' && 'px-4 py-2 text-base h-10',
                    className
                )}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'
