import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent'

interface BadgeProps {
    children: React.ReactNode
    variant?: BadgeVariant
    className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                variant === 'default' && 'bg-bg-tertiary text-text-secondary',
                variant === 'success' && 'bg-success-light text-success',
                variant === 'warning' && 'bg-warning-light text-warning',
                variant === 'danger' && 'bg-danger-light text-danger',
                variant === 'accent' && 'bg-accent-light text-accent',
                className
            )}
        >
            {children}
        </span>
    )
}
