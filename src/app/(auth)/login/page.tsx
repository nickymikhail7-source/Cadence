'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '380px',
                textAlign: 'center'
            }}>
                {/* Logo */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    backgroundColor: '#0A0A0A',
                    borderRadius: '12px',
                    marginBottom: '16px'
                }}>
                    <span style={{
                        color: '#FFFFFF',
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>C</span>
                </div>

                {/* Brand */}
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#0A0A0A',
                    margin: '0 0 4px 0'
                }}>Cadence</h1>

                <p style={{
                    fontSize: '14px',
                    color: '#737373',
                    margin: '0 0 40px 0'
                }}>Never miss a beat</p>

                {/* Welcome */}
                <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#0A0A0A',
                    margin: '0 0 8px 0'
                }}>Welcome back</h2>

                <p style={{
                    fontSize: '14px',
                    color: '#737373',
                    margin: '0 0 24px 0'
                }}>Sign in to access your inbox</p>

                {/* Google Button */}
                <button
                    onClick={() => signIn('google', { callbackUrl: '/focus' })}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '14px 20px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#0A0A0A',
                        transition: 'background-color 0.1s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div style={{
                    margin: '32px 0',
                    borderTop: '1px solid #E5E5E5'
                }}></div>

                {/* Features */}
                <p style={{
                    fontSize: '12px',
                    color: '#A3A3A3',
                    margin: '0 0 16px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>What you'll get</p>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    textAlign: 'left',
                    maxWidth: '260px',
                    margin: '0 auto'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#059669', fontSize: '16px' }}>✓</span>
                        <span style={{ fontSize: '14px', color: '#525252' }}>AI-powered email summaries</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#059669', fontSize: '16px' }}>✓</span>
                        <span style={{ fontSize: '14px', color: '#525252' }}>Smart scheduling links</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#059669', fontSize: '16px' }}>✓</span>
                        <span style={{ fontSize: '14px', color: '#525252' }}>Relationship health tracking</span>
                    </div>
                </div>

                {/* Security */}
                <p style={{
                    fontSize: '12px',
                    color: '#A3A3A3',
                    marginTop: '40px'
                }}>
                    🔒 Your data is encrypted and secure
                </p>
            </div>
        </div>
    )
}
