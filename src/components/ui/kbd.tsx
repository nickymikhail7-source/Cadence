import { cn } from '@/lib/utils'

interface KbdProps {
    children: React.ReactNode
    className?: string
}

export function Kbd({ children, className }: KbdProps) {
    return (
        <kbd
            className={cn(
                'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5',
                'bg-bg-tertiary border border-border-default rounded',
                'text-xs font-mono text-text-secondary',
                className
            )}
        >
            {children}
        </kbd>
    )
}
