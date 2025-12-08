'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type ShortcutHandler = () => void

interface ShortcutConfig {
    key: string
    metaKey?: boolean
    shiftKey?: boolean
    ctrlKey?: boolean
    handler: ShortcutHandler
}

export function useKeyboardShortcuts(
    shortcuts: ShortcutConfig[],
    enabled: boolean = true
) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            const target = e.target as HTMLElement
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                // Allow Escape to work in inputs
                if (e.key !== 'Escape') {
                    return
                }
            }

            for (const shortcut of shortcuts) {
                const metaMatches = shortcut.metaKey ? e.metaKey || e.ctrlKey : !e.metaKey && !e.ctrlKey
                const shiftMatches = shortcut.shiftKey ? e.shiftKey : !e.shiftKey
                const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase()

                if (keyMatches && metaMatches && shiftMatches) {
                    e.preventDefault()
                    shortcut.handler()
                    return
                }
            }
        },
        [shortcuts]
    )

    useEffect(() => {
        if (!enabled) return

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown, enabled])
}

// Global shortcuts hook for the dashboard
export function useGlobalShortcuts(onOpenCommandPalette: () => void) {
    const router = useRouter()

    useKeyboardShortcuts([
        {
            key: 'k',
            metaKey: true,
            handler: onOpenCommandPalette,
        },
        {
            key: '/',
            metaKey: true,
            handler: () => {
                // TODO: Show shortcuts modal
            },
        },
    ])

    // Sequential shortcuts (g then f, g then c, etc.)
    useEffect(() => {
        let waitingForSecond = false
        let timeout: NodeJS.Timeout

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return
            }

            if (waitingForSecond) {
                clearTimeout(timeout)
                waitingForSecond = false

                switch (e.key.toLowerCase()) {
                    case 'f':
                        e.preventDefault()
                        router.push('/focus')
                        break
                    case 'i':
                        e.preventDefault()
                        router.push('/inbox')
                        break
                    case 'c':
                        e.preventDefault()
                        router.push('/contacts')
                        break
                    case 'm':
                        e.preventDefault()
                        router.push('/calendar')
                        break
                }
                return
            }

            if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey) {
                waitingForSecond = true
                timeout = setTimeout(() => {
                    waitingForSecond = false
                }, 500)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            clearTimeout(timeout)
        }
    }, [router])
}
