import { cn } from '@/lib/utils'

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: React.ReactNode
    className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
            {icon && (
                <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mb-4 text-text-tertiary">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-text-primary mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-text-tertiary text-center max-w-sm">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}
