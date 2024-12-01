/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    safelist: [
        'text-primary',
        'bg-primary',
        'hover:text-primary',
        'hover:bg-primary',
        'text-vk'
    ],
    theme: {
        extend: {
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                background: 'rgba(2, 2, 2, 1)',
                onBackground: 'rgb(245, 245, 245)',
                surface: 'rgb(18, 18, 18)',
                surfaceVariant: 'rgba(10, 10, 10, 1)',
                onSurface: 'rgb(235, 235, 235)',
                onSurfaceVariant: 'rgb(188, 188, 188)',
                primary: 'rgb(168, 135, 248)',
                onPrimary: 'rgba(26, 26, 26, 1)',
                badge: 'rgba(168, 135, 248, 0.2)',
                additionalText: 'rgb(118, 118, 118)',
                hover: 'rgba(10, 10, 10, 1)',
                vk: 'rgba(0, 119, 255, 1)',
                sliderBg: 'rgba(29, 29, 29, 1)'
            }
        }
    },
    plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar')({ nocompatible: true })]
};
