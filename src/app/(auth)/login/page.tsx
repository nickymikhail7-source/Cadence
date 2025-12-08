'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 animate-gradient-xy">

            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Glass Card */}
            <div className="relative w-full max-w-md p-8 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 ring-1 ring-black/5">

                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white transform rotate-45"
                        >
                            <path
                                d="M12 4L12 20M4 12L20 12"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                        Welcome to Cadence
                    </h1>
                    <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
                        Your external brain for B2B relationships.
                    </p>
                </div>

                {/* Auth Actions */}
                <div className="space-y-4">
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/focus' })}
                        className="group relative w-full h-12 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:border-blue-400/50"
                    >
                        <div className="w-5 h-5 flex-shrink-0">
                            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-gray-900">
                            Continue with Google
                        </span>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100/50">
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-bold text-gray-900">10k+</span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mt-1">Users</span>
                        </div>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-bold text-gray-900">4.9</span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mt-1">Rating</span>
                        </div>
                    </div>
                    <p className="text-center text-xs text-blue-300 mt-6 font-medium">
                        Protected by enterprise-grade security
                    </p>
                </div>
            </div>
        </div>
    )
}
