'use client'

import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { CommandPalette } from '@/components/layout/command-palette'
import { useGlobalShortcuts } from '@/hooks/use-keyboard-shortcuts'

function DashboardContent({ children }: { children: React.ReactNode }) {
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

    useGlobalShortcuts(() => setCommandPaletteOpen(true))

    return (
        <div className="flex h-screen bg-bg-primary">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
            <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={() => setCommandPaletteOpen(false)}
            />
        </div>
    )
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <DashboardContent>{children}</DashboardContent>
        </SessionProvider>
    )
}
