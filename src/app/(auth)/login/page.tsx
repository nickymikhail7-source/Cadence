'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-50">

            {/* 1. THE AURORA MESH GRADIENT BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-blue-50 animate-gradient-xy opacity-80" />
                {/* Decorative Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            {/* 2. THE GLASS CARD */}
            <div className="relative z-10 w-full max-w-[400px] p-8 mx-4">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)]" />

                {/* Card Content */}
                <div className="relative z-20 flex flex-col items-center text-center animate-fade-in-up">

                    {/* Logo Mark */}
                    <div className="w-12 h-12 mb-6 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Typography */}
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                        Welcome to Cadence
                    </h1>
                    <p className="text-sm text-gray-500 mb-8 font-medium">
                        Your external brain for B2B relationships
                    </p>

                    {/* Google Button */}
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/focus' })}
                        className="group w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/10"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-gray-700 font-medium group-hover:text-gray-900">
                            Continue with Google
                        </span>
                    </button>

                    {/* Footer */}
                    <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>All systems operational</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
