import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
        } & DefaultSession['user']
    }
}

// Re-export Prisma types for convenience
export type {
    User,
    Contact,
    Email,
    Meeting,
    MeetingType,
    Availability,
    BlockedTime,
    Interaction,
    ContactType,
    ContactStatus,
    Direction,
    EmailCategory,
    Sentiment,
    MeetingStatus,
    LocationType,
    InteractionType,
} from '@prisma/client'

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
}

// Email types
export interface EmailWithContact {
    id: string
    gmailId: string
    threadId: string
    fromEmail: string
    fromName: string | null
    toEmails: string[]
    ccEmails: string[]
    subject: string
    snippet: string | null
    body: string | null
    bodyHtml: string | null
    date: Date
    isRead: boolean
    isStarred: boolean
    isArchived: boolean
    labels: string[]
    summary: string | null
    sentiment: string | null
    actionRequired: boolean
    direction: string
    category: string
    contact: {
        id: string
        name: string | null
        email: string
        company: string | null
        healthScore: number
        totalEmails: number
        totalMeetings: number
    } | null
}

// Contact types
export interface ContactWithStats {
    id: string
    email: string
    name: string | null
    company: string | null
    title: string | null
    avatar: string | null
    healthScore: number
    lastContactAt: Date | null
    firstContactAt: Date | null
    totalEmails: number
    totalMeetings: number
    avgResponseTime: number | null
    type: string
    status: string
    tags: string[]
    notes: string | null
}

// Meeting types
export interface TimeSlot {
    start: Date
    end: Date
}

export interface MeetingTypeWithUser {
    id: string
    name: string
    slug: string
    description: string | null
    duration: number
    bufferBefore: number
    bufferAfter: number
    minNotice: number
    maxAdvance: number
    locationType: string
    locationValue: string | null
    isActive: boolean
    requiresConfirmation: boolean
    questions: unknown
    user: {
        name: string | null
        email: string | null
        image: string | null
    }
}

export interface BookingRequest {
    meetingTypeId: string
    startTime: string
    timezone: string
    attendee: {
        name: string
        email: string
    }
    answers?: Record<string, string>
}

// Command palette types
export interface Command {
    id: string
    title: string
    description?: string
    icon: string
    shortcut?: string[]
    action: () => void
    category: 'action' | 'contact' | 'email' | 'navigation'
}
