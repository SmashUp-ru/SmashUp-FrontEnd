import * as React from 'react';

import { cn } from '@/lib/utils';
import { playOnce } from '@/lib/playAnimation';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
    ({ className, onPointerDown, ...props }, ref) => {
        const pressRef = React.useRef<HTMLSpanElement>(null);

        return (
            // className — на обёртке (как у Input): подложка тянется по ней, иначе
            // фон и кольцо фокуса разъедутся по ширине.
            <div className={cn('relative w-full', className)}>
                {/*
                 * Нажим играет подложка, а не само поле: если масштабировать
                 * textarea, вместе с ней ездят текст и уголок ресайза.
                 */}
                <span
                    ref={pressRef}
                    aria-hidden
                    className='pointer-events-none absolute inset-0 rounded-[15px] bg-surface'
                />
                <textarea
                    className={cn(
                        'relative flex min-h-[80px] w-full rounded-[15px] bg-transparent px-3 py-2 text-[15px] font-bold placeholder:text-onSurfaceVariant text-onSurface disabled:cursor-not-allowed disabled:opacity-50',
                        // То же кольцо, что у Input (раньше здесь было ring/box-shadow
                        // — расхождение из секции «Расхождения» на /kit).
                        'outline outline-2 outline-transparent outline-offset-[6px]',
                        'transition-[outline-color,outline-offset] [transition-duration:200ms] ease-spring motion-reduce:transition-none',
                        'focus:outline-primary focus:outline-offset-[2px]'
                    )}
                    ref={ref}
                    onPointerDown={(e) => {
                        if (pressRef.current) playOnce(pressRef.current, 'animate-press-input');
                        onPointerDown?.(e);
                    }}
                    {...props}
                />
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };
