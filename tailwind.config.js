/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                'gac-black': '#050505',
                'gac-white': '#e0e0e0',
                'gac-red': '#ff3333',
                'gac-purple': '#a020f0',
                'gac-dblue': '#111827'
            },
            fontFamily: {
                'mono': ['"Courier New"', 'monospace'],
                'main': ['Rajdhani', 'sans-serif'],
                'italiana': ['Italiana', 'serif'],
                'orbitron': ['Orbitron', 'sans-serif'],
            },
            keyframes: {
                scanline: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' }
                },
                spin: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                }
            },
            animation: {
                'gac-scan': 'scanline 8s linear infinite',
                'gac-spinner': 'spin 1s linear infinite'
            }
        },
    },
    safelist: [
        'text-green-500', 'bg-green-100', 'dark:bg-green-800', 'dark:text-green-200',
        'text-red-500', 'bg-red-100', 'dark:bg-red-800', 'dark:text-red-200',
        'text-orange-500', 'bg-orange-100', 'dark:bg-orange-800', 'dark:text-orange-200'
    ],
    plugins: [
        require('@tailwindcss/typography'),
        function ({ addUtilities }) {
            addUtilities({
                '.logo-clip': {
                    'clip-path': 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
                },
                '.terminal-window': {
                    'position': 'relative',
                    'border': '2px solid #e0e0e0',
                    'background-color': '#050505',
                    'box-shadow': '0 0 15px rgba(255, 255, 255, 0.05)',
                }
            })
        }
    ],
}