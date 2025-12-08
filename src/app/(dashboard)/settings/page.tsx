'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'

export default function SettingsPage() {
    const { data: session } = useSession()

    return (
        <div className="h-full p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold text-text-primary mb-6">Settings</h1>

                {/* Profile Section */}
                <div className="bg-bg-primary border border-border-subtle rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-medium text-text-primary mb-4">Profile</h2>
                    <div className="flex items-center gap-4">
                        <Avatar src={session?.user?.image} name={session?.user?.name} size="lg" />
                        <div>
                            <p className="font-medium text-text-primary">{session?.user?.name}</p>
                            <p className="text-sm text-text-tertiary">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Connected Accounts */}
                <div className="bg-bg-primary border border-border-subtle rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-medium text-text-primary mb-4">Connected accounts</h2>
                    <div className="flex items-center justify-between py-3 border-b border-border-subtle">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-bg-tertiary flex items-center justify-center">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-primary">Google</p>
                                <p className="text-xs text-text-tertiary">{session?.user?.email}</p>
                            </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-success-light text-success rounded">Connected</span>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-bg-primary border border-danger/20 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-danger mb-4">Danger zone</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-primary">Sign out</p>
                            <p className="text-xs text-text-tertiary">End your current session</p>
                        </div>
                        <Button variant="danger" onClick={() => signOut({ callbackUrl: '/login' })}>
                            Sign out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
