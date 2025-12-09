import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FocusView } from './focus-view'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function FocusPage() {
    // 1. Auth Check
    const session = await auth()
    if (!session?.user?.id) {
        redirect('/login')
    }

    // 2. Fetch Priority Email (FIFO - Oldest First)
    // We exclude low-priority categories to focus on what matters.
    // Schema Categories: NEEDS_RESPONSE, AWAITING_REPLY, FYI, MEETING_RELATED, AUTOMATED, OTHER
    // "PROMOTION", "SOCIAL", "UPDATES" conceptually map to AUTOMATED, FYI
    const email = await prisma.email.findFirst({
        where: {
            userId: session.user.id,
            isArchived: false,
            NOT: {
                category: {
                    in: ['AUTOMATED', 'FYI']
                }
            }
        },
        orderBy: {
            date: 'asc' // Oldest first (FIFO)
        },
        take: 1
    })

    // 3. Render View
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-gray-50/50">
            <div className="w-full max-w-3xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Focus Mode</h1>
                        <p className="text-gray-500 text-sm">Process your inbox one conversation at a time.</p>
                    </div>
                    {/* Optional: Add a subtle indicator of how many are left */}
                </div>

                <FocusView email={email} />

            </div>
        </div>
    )
}
