import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ username: string }>
}

export default async function UserBookingPage({ params }: PageProps) {
    const { username } = await params

    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: username },
        select: {
            name: true,
            email: true,
            image: true,
            meetingTypes: {
                where: { isActive: true },
                orderBy: { createdAt: 'asc' },
            },
        },
    })

    if (!user) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-bg-secondary">
            <div className="max-w-2xl mx-auto py-16 px-4">
                {/* Profile Header */}
                <div className="text-center mb-12">
                    {user.image && (
                        <img
                            src={user.image}
                            alt={user.name || 'User'}
                            className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-white shadow"
                        />
                    )}
                    <h1 className="text-2xl font-semibold text-text-primary">
                        {user.name || user.email}
                    </h1>
                    <p className="text-text-tertiary mt-1">Select a meeting type to book</p>
                </div>

                {/* Meeting Types */}
                <div className="space-y-4">
                    {user.meetingTypes.length === 0 ? (
                        <div className="text-center py-12 text-text-tertiary">
                            No meeting types available
                        </div>
                    ) : (
                        user.meetingTypes.map((type) => (
                            <Link
                                key={type.id}
                                href={`/meet/${username}/${type.slug}`}
                                className="block bg-bg-primary border border-border-subtle rounded-xl p-6
                  hover:border-accent hover:shadow-sm transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-medium text-text-primary">
                                            {type.name}
                                        </h2>
                                        <p className="text-sm text-text-tertiary mt-1">
                                            {type.duration} minutes
                                        </p>
                                        {type.description && (
                                            <p className="text-sm text-text-secondary mt-2">
                                                {type.description}
                                            </p>
                                        )}
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-text-quaternary"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Powered by */}
                <div className="text-center mt-12">
                    <p className="text-xs text-text-quaternary">
                        Powered by{' '}
                        <a href="/" className="text-accent hover:underline">
                            Cadence
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
