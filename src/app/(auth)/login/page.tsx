'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding & Value Prop */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13 3L4 14h7v7l9-11h-7V3z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">Cadence</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                            Your external relationships,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                perfectly orchestrated
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-md">
                            AI-powered email intelligence and smart scheduling that helps you never miss a beat with the people who matter most.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-medium mb-1">Smart Inbox</h3>
                            <p className="text-slate-400 text-sm">AI summaries & priority sorting</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-medium mb-1">Scheduling</h3>
                            <p className="text-slate-400 text-sm">Booking links like Calendly</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-medium mb-1">Relationships</h3>
                            <p className="text-slate-400 text-sm">Health scores & insights</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-medium mb-1">Lightning Fast</h3>
                            <p className="text-slate-400 text-sm">Keyboard-first design</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <p className="text-slate-500 text-sm">
                        Trusted by founders, sales teams, and professionals worldwide
                    </p>
                </div>
            </div>

            {/* Right Panel - Sign In */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13 3L4 14h7v7l9-11h-7V3z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-slate-900">Cadence</span>
                    </div>

                    {/* Welcome Text */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">
                            Welcome back
                        </h2>
                        <p className="text-slate-500">
                            Sign in to access your inbox and relationships
                        </p>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/focus' })}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-150 group mb-6"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="font-medium text-slate-700 group-hover:text-slate-900">
                            Continue with Google
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-400">We&apos;ll sync your Gmail</span>
                        </div>
                    </div>

                    {/* Permissions Info */}
                    <div className="bg-slate-50 rounded-xl p-5 mb-8">
                        <h3 className="text-sm font-medium text-slate-700 mb-3">What we&apos;ll access:</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Read your emails to provide AI summaries
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Send emails on your behalf when you reply
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Archive and organize your inbox
                            </li>
                        </ul>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-start gap-3 text-sm text-slate-500">
                        <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p>
                            Your data is encrypted and secure. We never share your information with third parties.
                            <a href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
