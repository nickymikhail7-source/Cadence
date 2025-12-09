import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const account = await prisma.account.findFirst({
            where: {
                userId: session.user.id,
                provider: 'google'
            }
        })

        return NextResponse.json({
            userId: session.user.id,
            email: session.user.email,
            accountFound: !!account,
            provider: account?.provider || 'none',
            accessTokenExists: !!account?.access_token,
            refreshTokenExists: !!account?.refresh_token,
            expiresAt: account?.expires_at ? new Date(account.expires_at * 1000).toISOString() : 'N/A',
            tokenType: account?.token_type,
            scope: account?.scope
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
