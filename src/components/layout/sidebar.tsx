'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Kbd } from '@/components/ui/kbd'

interface SidebarProps {
    needsResponse?: number
    awaitingReply?: number
    atRiskContacts?: number
}

interface NavItem {
    href: string
    label: string
    icon: React.ReactNode
    shortcut?: string
    count?: number
}

export function Sidebar({ needsResponse = 0, awaitingReply = 0, atRiskContacts = 0 }: SidebarProps) {
    const pathname = usePathname()

    const navItems: NavItem[] = [
        {
            href: '/focus',
            label: 'Focus',
            shortcut: 'F',
            count: needsResponse,
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
        },
        {
            href: '/inbox',
            label: 'Inbox',
            shortcut: 'I',
            count: awaitingReply,
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            href: '/contacts',
            label: 'Contacts',
            shortcut: 'C',
            count: atRiskContacts,
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            href: '/calendar',
            label: 'Calendar',
            shortcut: 'M',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            href: '/scheduling',
            label: 'Scheduling',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ]

    return (
        <aside className="w-56 h-screen bg-bg-secondary border-r border-border-subtle flex flex-col">
            {/* Logo */}
            <div className="h-14 flex items-center px-4 border-b border-border-subtle">
                <Link href="/focus" className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-lg text-text-primary">Cadence</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-fast',
                                isActive
                                    ? 'bg-accent-light text-accent'
                                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                            )}
                        >
                            {item.icon}
                            <span className="flex-1">{item.label}</span>
                            {item.count !== undefined && item.count > 0 && (
                                <span
                                    className={cn(
                                        'min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium flex items-center justify-center',
                                        isActive ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary'
                                    )}
                                >
                                    {item.count}
                                </span>
                            )}
                            {item.shortcut && !item.count && (
                                <Kbd className="opacity-50">{item.shortcut}</Kbd>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border-subtle">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-tertiary hover:bg-bg-hover hover:text-text-primary transition-colors duration-fast"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                </Link>
            </div>
        </aside>
    )
}
