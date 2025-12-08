import { cn, getHealthStatus } from '@/lib/utils'

interface HealthIndicatorProps {
    score: number
    showLabel?: boolean
    showScore?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function HealthIndicator({
    score,
    showLabel = false,
    showScore = false,
    size = 'md',
    className,
}: HealthIndicatorProps) {
    const status = getHealthStatus(score)
    const label = status === 'strong' ? 'Strong' : status === 'moderate' ? 'Cooling' : 'At Risk'

    const dotSizes = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5',
    }

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div
                className={cn(
                    'rounded-full',
                    dotSizes[size],
                    status === 'strong' && 'bg-health-strong',
                    status === 'moderate' && 'bg-health-moderate',
                    status === 'weak' && 'bg-health-weak'
                )}
            />
            {(showLabel || showScore) && (
                <span
                    className={cn(
                        'font-medium',
                        textSizes[size],
                        status === 'strong' && 'text-health-strong',
                        status === 'moderate' && 'text-health-moderate',
                        status === 'weak' && 'text-health-weak'
                    )}
                >
                    {showScore ? score : label}
                </span>
            )}
        </div>
    )
}
