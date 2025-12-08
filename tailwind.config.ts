import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Backgrounds (Glacier White)
                'bg-primary': '#FFFFFF',
                'bg-secondary': '#FAFAFA',
                'bg-tertiary': '#F5F5F5',
                'bg-hover': '#F0F0F0',

                // Text (Foundry Grey)
                'text-primary': '#0A0A0A',
                'text-secondary': '#525252',
                'text-tertiary': '#737373',
                'text-quaternary': '#A3A3A3',

                // Accent (Electric Cobalt)
                accent: {
                    DEFAULT: '#2563EB',
                    hover: '#1D4ED8',
                    light: '#EFF6FF',
                    subtle: '#DBEAFE',
                },

                // Success (Subtle Emerald)
                success: {
                    DEFAULT: '#059669',
                    light: '#ECFDF5',
                },

                // Warning
                warning: {
                    DEFAULT: '#D97706',
                    light: '#FFFBEB',
                },

                // Danger
                danger: {
                    DEFAULT: '#DC2626',
                    light: '#FEF2F2',
                },

                // Health indicators
                health: {
                    strong: '#059669',
                    moderate: '#D97706',
                    weak: '#DC2626',
                },

                // Borders
                'border-subtle': '#E5E5E5',
                'border-default': '#D4D4D4',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
            },
            fontSize: {
                'xs': ['11px', { lineHeight: '1.4' }],
                'sm': ['13px', { lineHeight: '1.5' }],
                'base': ['14px', { lineHeight: '1.6' }],
                'lg': ['16px', { lineHeight: '1.5' }],
                'xl': ['20px', { lineHeight: '1.4' }],
                '2xl': ['24px', { lineHeight: '1.3' }],
            },
            transitionDuration: {
                'fast': '50ms',
                'normal': '100ms',
            },
            animation: {
                'fade-in': 'fadeIn 100ms ease-out',
                'slide-up': 'slideUp 100ms ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}

export default config
