/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';
import scrollbar from 'tailwind-scrollbar';
import typography from '@tailwindcss/typography';

// Критически задемпфированная пружина (ζ = 1) как easing: сэмплы
// p(t) = 1 − (1 + ω·t)·e^(−ω·t), ω = 6.6, 33 точки, нормировано на [0,1].
// Перелёта нет by design, но затухание живее «механического» ease-out.
// Меньше пары десятков точек пружину не передают; здесь макс. ошибка
// кусочно-линейной аппроксимации ≈ 0.004. Запятые внутри linear() не разрывают
// шортхенд animation — парсер CSS балансирует скобки. linear() поддерживается
// во всех основных браузерах с 12.2023.
// Единый источник кривой: пресс кнопок (animation) + утилита ease-spring
// (transition) + морф play/pause (там та же формула, но в JS).
const SPRING =
    'linear(0, 0.019, 0.066, 0.129, 0.202, 0.279, 0.355, 0.428, 0.496, 0.559, 0.617, 0.669, 0.715, 0.756, 0.792, 0.823, 0.85, 0.874, 0.894, 0.912, 0.927, 0.94, 0.951, 0.96, 0.968, 0.975, 0.98, 0.985, 0.989, 0.993, 0.996, 0.998, 1)';

export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    safelist: [
        'text-onSurface',
        'text-onSurfaceVariant/50',
        'text-primary',
        'bg-primary',
        'hover:text-primary',
        'hover:bg-primary',
        'text-vk',
        'text-error',
        'bg-error',
        'hover:text-error',
        'hover:bg-error',
		'bg-hoverPrimary',
		'text-hoverPrimary',
		'hover:bg-hoverPrimary',
		'hover:text-hoverPrimary',
		'bg-hover',
		'hover:bg-hover',
		'group-hover:bg-hover',
		'animate-press',
		'animate-press-input',
		'animate-skip',

        'h-[calc(100%-148px)]',
        'h-[calc(100%-32px)]',
        'md:h-[calc(100%-148px)]',
        'md:h-[calc(100%-32px)]',
        'md:h-[calc(100%-16px)]'
    ],
    theme: {
    	extend: {
    		// `ease-spring` — та же пружина, что у пресса кнопок, но для transition.
    		transitionTimingFunction: {
    			spring: SPRING
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
				hoverPrimary:'rgba(150, 112, 246, 1)',
    			vk: 'rgba(0, 119, 255, 1)',
    			sliderBg: 'rgba(29, 29, 29, 1)',
    			error: 'rgba(255, 69, 69, 1)',
    			onError: 'rgba(11, 11, 11, 1)',
    			pink: 'pink',
    			ring: 'rgb(168, 135, 248)',
    			destructive: 'rgba(255, 69, 69, 1)',
    			'destructive-foreground': 'rgb(245, 245, 245)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			shimmer: {
    				'100%': {
    					transform: 'translateX(100%)'
    				}
    			},
    			pop: {
    				'0%': {
    					transform: 'scale(1)'
    				},
    				'40%': {
    					transform: 'scale(1.3)'
    				},
    				'70%': {
    					transform: 'scale(0.92)'
    				},
    				'100%': {
    					transform: 'scale(1)'
    				}
    			},
    			// Пресс-фидбэк кнопок — «нажим без отскока», параметры подобраны на
    			// витрине /kit (матрицы снесены после выбора):
    			//   атака мгновенная — кнопка уже вдавлена на 0% кадре;
    			//   сжатие анизотропное (squish) 0.95 по X и 0.91 по Y — по X сжимаем
    			//     меньше, чем по Y, поэтому кнопка читается придавленной, а не
    			//     отъехавшей (эквивалент равномерного — 0.94);
    			//   возврат за 240ms по критически задемпфированной пружине (см. `animation`).
    			// Используем свойство `scale`, а НЕ `transform`, чтобы не затирать
    			// позиционирующие transform:translate у icon-кнопок (напр. play-оверлей
    			// в тумбах центрируется translate).
    			press: {
    				'0%': { scale: '0.95 0.91' },
    				'100%': { scale: '1 1' }
    			},
    			// Нажим для полей ввода — тот же принцип, что у кнопок, но заметно
    			// мягче: поле широкое, и при кнопочных 0.95/0.91 край уезжал бы на
    			// десятки пикселей. По X почти не двигаем, придавливаем по Y.
    			'press-input': {
    				'0%': { scale: '0.995 0.96' },
    				'100%': { scale: '1 1' }
    			},
    			// Направленный отскок скипа: иконка уезжает в сторону перехода и
    			// возвращается. Уход быстрый (ease-out), возврат — по той же пружине,
    			// что и пресс: timing-function, объявленная в кадре, действует на
    			// сегмент, который с этого кадра начинается.
    			// Направление задаётся переменной --skip-shift (для «назад» — минус).
    			// Свойство `translate`, а НЕ transform — чтобы не затирать чужие
    			// трансформы на иконке.
    			skip: {
    				'0%': {
    					translate: '0',
    					animationTimingFunction: 'cubic-bezier(0.2, 0, 0.4, 1)'
    				},
    				'30%': {
    					translate: 'var(--skip-shift, 5px)',
    					animationTimingFunction: SPRING
    				},
    				'100%': { translate: '0' }
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			shimmer: 'shimmer 1.6s infinite',
    			// (см. transitionTimingFunction.spring — та же кривая для transition)
    			pop: 'pop 0.3s ease-out',
    			// Кривая — SPRING (см. верх файла).
    			press: `press 0.24s ${SPRING}`,
    			'press-input': `press-input 0.24s ${SPRING}`,
    			// Тайминги — покадрово внутри keyframe `skip`.
    			skip: 'skip 0.36s'
    		}
    	}
    },
    plugins: [animate, scrollbar({ nocompatible: true }), typography]
};
