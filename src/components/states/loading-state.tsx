import { cn } from '@/lib/utils'

interface LoadingStateProps {
    message?: string
    className?: string
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
            <div className="w-8 h-8 border-2 border-border-default border-t-accent rounded-full animate-spin mb-4" />
            <p className="text-sm text-text-tertiary">{message}</p>
        </div>
    )
}
