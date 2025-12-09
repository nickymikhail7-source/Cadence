'use client'

import { useState } from 'react'

export default function DebugPage() {
    const [syncResult, setSyncResult] = useState<any>(null)
    const [accountResult, setAccountResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [loadingSync, setLoadingSync] = useState(false)
    const [loadingAccount, setLoadingAccount] = useState(false)

    const handleSync = async () => {
        setLoadingSync(true)
        setSyncResult(null)
        setError(null)
        try {
            const res = await fetch('/api/emails/sync', { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
            setSyncResult(data)
        } catch (err: any) {
            console.error('Sync error:', err)
            setError(err.message || 'Unknown error')
        } finally {
            setLoadingSync(false)
        }
    }

    const handleCheckAccount = async () => {
        setLoadingAccount(true)
        setAccountResult(null)
        setError(null)
        try {
            const res = await fetch('/api/debug/account')
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
            setAccountResult(data)
        } catch (err: any) {
            console.error('Account check error:', err)
            setError(err.message || 'Unknown error')
        } finally {
            setLoadingAccount(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">System Diagnostics</h1>
                <p className="text-gray-500 mt-2">Internal tools for backend debugging.</p>
            </div>

            {/* Sync Tool */}
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Email Synchronization</h2>
                <p className="text-sm text-gray-600">
                    Manually trigger the Gmail sync engine. This will fetch recent emails and update the database.
                </p>

                <button
                    onClick={handleSync}
                    disabled={loadingSync}
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loadingSync ? 'Syncing...' : 'Force Email Sync'}
                </button>

                {/* Sync Output */}
                {(syncResult || (error && loadingSync === false && !accountResult)) && (
                    <div className={`mt-4 p-4 rounded-lg border font-mono text-xs overflow-auto max-h-[400px] ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                        {error ? `❌ Error: ${error}` : JSON.stringify(syncResult, null, 2)}
                    </div>
                )}
            </div>

            {/* Account Inspector */}
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Account Inspector</h2>
                <p className="text-sm text-gray-600">
                    Check the database for valid Google OAuth tokens and connection status.
                </p>

                <button
                    onClick={handleCheckAccount}
                    disabled={loadingAccount}
                    className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loadingAccount ? 'Checking...' : 'Check Account Status'}
                </button>

                {/* Account Output */}
                {accountResult && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 font-mono text-xs overflow-auto">
                        <pre className="text-gray-800 whitespace-pre-wrap">
                            {JSON.stringify(accountResult, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
