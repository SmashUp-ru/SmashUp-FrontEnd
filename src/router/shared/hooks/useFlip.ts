import { useLayoutEffect, useRef } from 'react';

/**
 * FLIP для списков: элемент, сменивший место, стартует со старой позиции и доезжает
 * transition-ом, который задан на нём самом (`transition-transform ease-spring`).
 * offsetTop не зависит от transform, поэтому перестановка посреди анимации не сбивает
 * замер. `deps` — то, от чего меняется порядок. Возвращает ref-колбэк по ключу.
 */
export function useFlip(deps: unknown) {
    const els = useRef(new Map<string, HTMLElement>());
    const tops = useRef(new Map<string, number>());

    useLayoutEffect(() => {
        tops.current.forEach((_, key) => {
            if (!els.current.has(key)) tops.current.delete(key);
        });
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        els.current.forEach((el, key) => {
            const top = el.offsetTop;
            const prev = tops.current.get(key);
            tops.current.set(key, top);
            if (reduce || prev === undefined || prev === top) return;
            const shift = new DOMMatrix(getComputedStyle(el).transform).m42;
            el.style.transition = 'none';
            el.style.transform = `translateY(${prev - top + shift}px)`;
            void el.offsetHeight; // зафиксировать стартовую позицию до включения перехода
            el.style.transition = '';
            el.style.transform = '';
        });
    }, [deps]);

    return (key: string) => (el: HTMLElement | null) => {
        // позицию в tops не трогаем: React зовёт ref(null) → ref(el) на каждом рендере
        // (колбэк новый), и стёртая позиция ломала бы анимацию; лишние ключи чистит эффект
        if (el) els.current.set(key, el);
        else els.current.delete(key);
    };
}
