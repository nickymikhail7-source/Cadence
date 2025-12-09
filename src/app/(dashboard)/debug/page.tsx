'use client'

import { useState } from 'react'

export default function DebugPage() {
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSync = async () => {
        setLoading(true)
        setResult(null)
        setError(null)

        try {
            const res = await fetch('/api/emails/sync', {
                method: 'POST',
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || `Error ${res.status}: ${res.statusText}`)
            }

            setResult(data)
        } catch (err: any) {
            console.error('Sync error:', err)
            setError(err.message || 'An unknown error occurred')
        } finally {
            setLoading(false)
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
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Syncing...' : 'Force Email Sync'}
                </button>

                {/* Output Area */}
                {(result || error) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 font-mono text-xs overflow-auto max-h-[400px]">
                        {error && (
                            <div className="text-red-600 font-bold mb-2">
                                ❌ Error: {error}
                            </div>
                        )}
                        {result && (
                            <pre className="text-green-700 whitespace-pre-wrap">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
