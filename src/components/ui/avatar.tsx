import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
    src?: string | null
    name?: string | null
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
    }

    if (src) {
        return (
            <img
                src={src}
                alt={name || 'Avatar'}
                className={cn(
                    'rounded-full object-cover',
                    sizeClasses[size],
                    className
                )}
            />
        )
    }

    return (
        <div
            className={cn(
                'rounded-full bg-accent-subtle text-accent font-medium',
                'flex items-center justify-center',
                sizeClasses[size],
                className
            )}
        >
            {getInitials(name)}
        </div>
    )
}
