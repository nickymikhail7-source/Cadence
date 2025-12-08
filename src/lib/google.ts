import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'

/**
 * Gets a valid access token for the user, refreshing it if necessary.
 * This is critical for background jobs and long-running sessions.
 */
export async function getValidAccessToken(userId: string): Promise<string> {
    // 1. Fetch account with credentials
    const account = await prisma.account.findFirst({
        where: { userId, provider: 'google' },
    })

    if (!account || !account.refresh_token) {
        throw new Error('No Google account or refresh token found')
    }

    const now = Math.floor(Date.now() / 1000)
    const isExpired = account.expires_at ? now >= account.expires_at : true

    // 2. If valid, return current token
    if (!isExpired && account.access_token) {
        return account.access_token
    }

    // 3. If expired, refresh it
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        )

        oauth2Client.setCredentials({
            refresh_token: account.refresh_token,
        })

        // This forces a refresh
        const { credentials } = await oauth2Client.refreshAccessToken()

        if (!credentials.access_token) {
            throw new Error('Failed to retrieve access token from Refresh grant')
        }

        // 4. Save new credentials to database
        await prisma.account.update({
            where: {
                provider_providerAccountId: {
                    provider: 'google',
                    providerAccountId: account.providerAccountId,
                },
            },
            data: {
                access_token: credentials.access_token,
                // Calculate new expiry (typically 3599 seconds from now)
                expires_at: Math.floor(Date.now() / 1000 + (credentials.expiry_date || 3600)),
                // Some providers rotate refresh tokens too
                refresh_token: credentials.refresh_token ?? account.refresh_token,
                token_type: credentials.token_type ?? 'Bearer',
                scope: credentials.scope ?? account.scope,
            },
        })

        return credentials.access_token
    } catch (error) {
        console.error('Token refresh failed:', error)
        // If refresh fails, the user needs to re-login. 
        // We throw to stop the sync process.
        throw new Error('Failed to refresh Google access token')
    }
}
