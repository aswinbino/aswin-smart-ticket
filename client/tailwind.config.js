/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-navy': 'var(--deep-navy)',
                'ocean-blue': 'var(--ocean-blue)',
                'teal-accent': 'var(--teal-accent)',
                'mint': 'var(--mint)',
                'success': 'var(--success)',
                'warning': 'var(--warning)',
                'error': 'var(--error)',
                'neutral-custom': 'var(--neutral)',
                'slate-custom': 'var(--slate)',
                'charcoal': 'var(--charcoal)',
                'warm-gray': 'var(--warm-gray)',
            }
        },
    },
    plugins: [],
}
