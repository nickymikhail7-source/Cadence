'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ error, className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    'w-full px-3 py-2 text-sm bg-bg-primary text-text-primary',
                    'border rounded-md transition-all duration-fast',
                    'placeholder:text-text-quaternary',
                    'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-secondary',
                    error ? 'border-danger' : 'border-border-default hover:border-border-subtle',
                    className
                )}
                {...props}
            />
        )
    }
)

Input.displayName = 'Input'
