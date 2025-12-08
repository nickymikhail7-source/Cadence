'use client'

import { useSession, signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/avatar'
import { Kbd } from '@/components/ui/kbd'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface HeaderProps {
    onOpenCommandPalette?: () => void
}

export function Header({ onOpenCommandPalette }: HeaderProps) {
    const { data: session } = useSession()
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="h-14 bg-bg-primary border-b border-border-subtle flex items-center justify-between px-6">
            {/* Command Palette Trigger */}
            <button
                onClick={onOpenCommandPalette}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-tertiary bg-bg-secondary border border-border-subtle rounded-lg hover:border-border-default hover:text-text-secondary transition-colors duration-fast"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search or command...</span>
                <div className="flex items-center gap-0.5 ml-2">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                </div>
            </button>

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-bg-hover transition-colors duration-fast"
                >
                    <Avatar
                        src={session?.user?.image}
                        name={session?.user?.name}
                        size="sm"
                    />
                    <span className="text-sm font-medium text-text-primary">
                        {session?.user?.name?.split(' ')[0]}
                    </span>
                    <svg
                        className={cn('w-4 h-4 text-text-tertiary transition-transform', menuOpen && 'rotate-180')}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-bg-primary border border-border-subtle rounded-lg shadow-lg py-1 z-50 animate-fade-in">
                        <div className="px-3 py-2 border-b border-border-subtle">
                            <p className="text-sm font-medium text-text-primary truncate">{session?.user?.name}</p>
                            <p className="text-xs text-text-tertiary truncate">{session?.user?.email}</p>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
