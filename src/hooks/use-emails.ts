'use client'

import { useState, useCallback } from 'react'

interface Email {
    id: string
    gmailId: string
    threadId: string
    fromEmail: string
    fromName: string | null
    toEmails: string[]
    subject: string
    snippet: string | null
    body: string | null
    bodyHtml: string | null
    date: string
    isRead: boolean
    isStarred: boolean
    isArchived: boolean
    direction: 'INBOUND' | 'OUTBOUND'
    category: string
    actionRequired: boolean
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

interface UseEmailsReturn {
    emails: Email[]
    total: number
    needsResponse: number
    awaitingReply: number
    loading: boolean
    error: string | null
    fetchEmails: (filter?: string) => Promise<void>
    archiveEmail: (id: string) => Promise<void>
    syncEmails: () => Promise<{ synced: number; skipped: number }>
}

export function useEmails(): UseEmailsReturn {
    const [emails, setEmails] = useState<Email[]>([])
    const [total, setTotal] = useState(0)
    const [needsResponse, setNeedsResponse] = useState(0)
    const [awaitingReply, setAwaitingReply] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchEmails = useCallback(async (filter?: string) => {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            if (filter) params.set('filter', filter)

            const response = await fetch(`/api/emails?${params}`)
            if (!response.ok) throw new Error('Failed to fetch emails')

            const data = await response.json()
            setEmails(data.emails)
            setTotal(data.total)
            setNeedsResponse(data.needsResponse)
            setAwaitingReply(data.awaitingReply)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }, [])

    const archiveEmail = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/emails/${id}/archive`, {
                method: 'POST',
            })
            if (!response.ok) throw new Error('Failed to archive')

            // Remove from local state
            setEmails(emails => emails.filter(e => e.id !== id))
            setTotal(t => t - 1)
            setNeedsResponse(n => Math.max(0, n - 1))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        }
    }, [])

    const syncEmails = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/emails/sync', {
                method: 'POST',
            })
            if (!response.ok) throw new Error('Failed to sync emails')

            const data = await response.json()

            // Refresh email list
            await fetchEmails('needs_response')

            return { synced: data.synced, skipped: data.skipped }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            throw err
        } finally {
            setLoading(false)
        }
    }, [fetchEmails])

    return {
        emails,
        total,
        needsResponse,
        awaitingReply,
        loading,
        error,
        fetchEmails,
        archiveEmail,
        syncEmails,
    }
}
