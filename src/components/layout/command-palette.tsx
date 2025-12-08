'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Kbd } from '@/components/ui/kbd'
import { Avatar } from '@/components/ui/avatar'
import { HealthIndicator } from '@/components/ui/health-indicator'

interface CommandPaletteProps {
    isOpen: boolean
    onClose: () => void
}

interface CommandItem {
    id: string
    title: string
    description?: string
    icon: React.ReactNode
    shortcut?: string[]
    category: 'navigation' | 'action' | 'contact' | 'email'
    onSelect: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    // Define commands
    const commands: CommandItem[] = [
        {
            id: 'nav-focus',
            title: 'Go to Focus',
            description: 'Process emails one by one',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            shortcut: ['G', 'F'],
            category: 'navigation',
            onSelect: () => { router.push('/focus'); onClose() },
        },
        {
            id: 'nav-inbox',
            title: 'Go to Inbox',
            description: 'View all emails',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            shortcut: ['G', 'I'],
            category: 'navigation',
            onSelect: () => { router.push('/inbox'); onClose() },
        },
        {
            id: 'nav-contacts',
            title: 'Go to Contacts',
            description: 'Manage relationships',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            shortcut: ['G', 'C'],
            category: 'navigation',
            onSelect: () => { router.push('/contacts'); onClose() },
        },
        {
            id: 'nav-calendar',
            title: 'Go to Calendar',
            description: 'View meetings',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            shortcut: ['G', 'M'],
            category: 'navigation',
            onSelect: () => { router.push('/calendar'); onClose() },
        },
        {
            id: 'nav-scheduling',
            title: 'Manage Scheduling',
            description: 'Booking links and availability',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            category: 'navigation',
            onSelect: () => { router.push('/scheduling'); onClose() },
        },
        {
            id: 'action-sync',
            title: 'Sync emails',
            description: 'Fetch latest from Gmail',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            category: 'action',
            onSelect: () => { /* TODO: implement sync */ onClose() },
        },
        {
            id: 'nav-settings',
            title: 'Settings',
            description: 'Configure your account',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            category: 'navigation',
            onSelect: () => { router.push('/settings'); onClose() },
        },
    ]

    // Filter commands based on query
    const filteredCommands = query
        ? commands.filter(
            (cmd) =>
                cmd.title.toLowerCase().includes(query.toLowerCase()) ||
                cmd.description?.toLowerCase().includes(query.toLowerCase())
        )
        : commands

    // Reset selected index when query changes
    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
            setQuery('')
            setSelectedIndex(0)
        }
    }, [isOpen])

    // Scroll selected item into view
    useEffect(() => {
        const selectedElement = listRef.current?.children[selectedIndex] as HTMLElement
        selectedElement?.scrollIntoView({ block: 'nearest' })
    }, [selectedIndex])

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1))
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setSelectedIndex((i) => Math.max(i - 1, 0))
                    break
                case 'Enter':
                    e.preventDefault()
                    filteredCommands[selectedIndex]?.onSelect()
                    break
                case 'Escape':
                    e.preventDefault()
                    onClose()
                    break
            }
        },
        [filteredCommands, selectedIndex, onClose]
    )

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg z-50 animate-slide-up">
                <div className="bg-bg-primary border border-border-subtle rounded-xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
                        <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a command or search..."
                            className="flex-1 bg-transparent text-text-primary text-sm placeholder:text-text-quaternary outline-none"
                        />
                        <Kbd>ESC</Kbd>
                    </div>

                    {/* Command List */}
                    <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
                        {filteredCommands.length === 0 ? (
                            <div className="px-4 py-8 text-center text-text-tertiary text-sm">
                                No results found
                            </div>
                        ) : (
                            filteredCommands.map((cmd, index) => (
                                <button
                                    key={cmd.id}
                                    onClick={cmd.onSelect}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-fast',
                                        index === selectedIndex ? 'bg-accent-light' : 'hover:bg-bg-hover'
                                    )}
                                >
                                    <span className={cn(
                                        'flex-shrink-0',
                                        index === selectedIndex ? 'text-accent' : 'text-text-tertiary'
                                    )}>
                                        {cmd.icon}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            'text-sm font-medium truncate',
                                            index === selectedIndex ? 'text-accent' : 'text-text-primary'
                                        )}>
                                            {cmd.title}
                                        </p>
                                        {cmd.description && (
                                            <p className="text-xs text-text-tertiary truncate">
                                                {cmd.description}
                                            </p>
                                        )}
                                    </div>
                                    {cmd.shortcut && (
                                        <div className="flex items-center gap-0.5">
                                            {cmd.shortcut.map((key, i) => (
                                                <Kbd key={i} className="opacity-60">{key}</Kbd>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-border-subtle bg-bg-secondary flex items-center gap-4 text-xs text-text-tertiary">
                        <span className="flex items-center gap-1">
                            <Kbd>↑</Kbd><Kbd>↓</Kbd> to navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <Kbd>↵</Kbd> to select
                        </span>
                        <span className="flex items-center gap-1">
                            <Kbd>esc</Kbd> to close
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
