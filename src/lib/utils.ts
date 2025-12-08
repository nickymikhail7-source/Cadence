import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    })
}

export function formatTime(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

export function formatRelativeTime(date: Date | string): string {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(date)
}

export function daysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function getInitials(name: string | null | undefined): string {
    if (!name) return '?'
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function calculateHealthScore(contact: {
    lastContactAt: Date | null
    totalEmails: number
    avgResponseTime: number | null
}): number {
    let score = 50 // Base score

    const daysSinceContact = contact.lastContactAt
        ? daysBetween(contact.lastContactAt, new Date())
        : 999

    // Recency factor (most important)
    if (daysSinceContact <= 3) score += 30
    else if (daysSinceContact <= 7) score += 20
    else if (daysSinceContact <= 14) score += 10
    else if (daysSinceContact <= 30) score += 0
    else if (daysSinceContact <= 60) score -= 15
    else score -= 30

    // Frequency factor
    if (contact.totalEmails >= 20) score += 10
    else if (contact.totalEmails >= 10) score += 5

    // Response time factor
    if (contact.avgResponseTime && contact.avgResponseTime < 60) score += 10
    else if (contact.avgResponseTime && contact.avgResponseTime < 240) score += 5

    // Clamp to 0-100
    return Math.max(0, Math.min(100, score))
}

export function getHealthStatus(score: number): 'strong' | 'moderate' | 'weak' {
    if (score >= 70) return 'strong'
    if (score >= 40) return 'moderate'
    return 'weak'
}

export function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
}

export function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}
