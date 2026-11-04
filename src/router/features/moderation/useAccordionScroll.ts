import { RefObject, useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/player.ts';

const ANIM_MS = 200; // accordion-down/up в tailwind.config.js
const MARGIN = 16;
const BAR_SPACE = 112; // плеер-бар fixed снизу (96 + отступ), на мобайле перекрывает документ

function scrollParent(el: HTMLElement): HTMLElement {
    for (let p = el.parentElement; p; p = p.parentElement) {
        const oy = getComputedStyle(p).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight) return p;
    }
    return document.scrollingElement as HTMLElement;
}

function isDocument(scroller: HTMLElement) {
    return scroller === document.scrollingElement;
}

function playerActive() {
    const s = usePlayerStore.getState();
    return s.queue.length > 0 || s.moderationSrc !== null || s.vkMashupSrc !== null;
}

/** Видимая область прокрутки в координатах окна. */
function viewport(scroller: HTMLElement) {
    if (isDocument(scroller)) {
        return { top: 0, bottom: window.innerHeight - (playerActive() ? BAR_SPACE : 0) };
    }
    const r = scroller.getBoundingClientRect();
    return { top: r.top, bottom: Math.min(r.bottom, window.innerHeight) };
}

const SPACER_ATTR = 'data-collapse-spacer';

/**
 * Прокрутка при раскрытии/скрытии строки аккордеона.
 *
 * Раскрытие: после анимации докручиваем ровно настолько, чтобы блок был виден
 * целиком (и ещё раз, если он вырос, пока догружались исходники), но шапку
 * строки за верх экрана не уводим.
 *
 * Скрытие: блок схлопывается под шапкой, и она остаётся на месте сама. Но если
 * страница прокручена до конца, после схлопывания браузер упрётся в новый низ и
 * подкинет экран. Поэтому внизу временно ставим распорку на «недостающую» высоту;
 * она тает по мере прокрутки вверх и исчезает, когда перестаёт быть нужна.
 */
export function useAccordionScroll(
    itemRef: RefObject<HTMLElement>,
    contentRef: RefObject<HTMLElement>,
    isOpen: boolean
) {
    // Реагируем только на настоящую смену состояния: в StrictMode эффект
    // запускается дважды на монтировании и выглядел бы как «строку закрыли».
    const prevOpen = useRef(isOpen);

    useEffect(() => {
        if (prevOpen.current === isOpen) return;
        prevOpen.current = isOpen;
        const item = itemRef.current;
        if (!item) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isOpen) {
            const reveal = () => {
                // Контейнер ищем сейчас, а не до раскрытия: пока блок не раскрылся,
                // список мог помещаться целиком и контейнер ещё не прокручивался.
                const scroller = scrollParent(item);
                const r = item.getBoundingClientRect();
                const v = viewport(scroller);
                const overflow = r.bottom - (v.bottom - MARGIN);
                if (overflow <= 0) return;
                const delta = Math.min(overflow, r.top - (v.top + MARGIN));
                if (delta <= 0) return;
                const opts: ScrollToOptions = { top: delta, behavior: reduce ? 'auto' : 'smooth' };
                if (isDocument(scroller)) window.scrollBy(opts);
                else scroller.scrollBy(opts);
            };
            const timer = window.setTimeout(reveal, ANIM_MS + 20);
            // Исходники догружаются после раскрытия — блок может вырасти.
            const content = contentRef.current;
            let lastH = content?.offsetHeight ?? 0;
            const ro = new ResizeObserver(() => {
                const h = content?.offsetHeight ?? 0;
                if (h > lastH + 1) {
                    lastH = h;
                    window.setTimeout(reveal, 50);
                }
            });
            if (content) ro.observe(content);
            const stop = window.setTimeout(() => ro.disconnect(), 1500);
            return () => {
                clearTimeout(timer);
                clearTimeout(stop);
                ro.disconnect();
            };
        }

        // Скрытие: эффект срабатывает до того, как анимация схлопнула блок, — высоты ещё полные.
        const scroller = scrollParent(item);
        const collapsing = contentRef.current?.offsetHeight ?? 0;
        const visibleH = isDocument(scroller) ? window.innerHeight : scroller.clientHeight;
        const lack = scroller.scrollTop + visibleH - (scroller.scrollHeight - collapsing);
        if (lack <= 0) return;

        const host = isDocument(scroller) ? document.body : scroller;
        let spacer = host.querySelector<HTMLElement>(`:scope > [${SPACER_ATTR}]`);
        if (!spacer) {
            spacer = document.createElement('div');
            spacer.setAttribute(SPACER_ATTR, '');
            spacer.setAttribute('aria-hidden', 'true');
            spacer.style.flexShrink = '0'; // контейнер на десктопе — flex-колонка, сжал бы до нуля
            host.appendChild(spacer);
        }
        const target = isDocument(scroller) ? window : scroller;
        const current = parseFloat(spacer.style.height) || 0;
        spacer.style.height = `${current + lack}px`;

        const shrink = () => {
            if (!spacer) return;
            const h = parseFloat(spacer.style.height) || 0;
            const vis = isDocument(scroller) ? window.innerHeight : scroller.clientHeight;
            // Сколько распорки ещё нужно, чтобы без неё прокрутку не прижало к новому низу.
            // Если страница короче экрана, прижимать некуда — распорка не нужна вовсе.
            const naturalMax = Math.max(0, scroller.scrollHeight - h - vis);
            const need = Math.max(0, scroller.scrollTop - naturalMax);
            if (need < h) spacer.style.height = `${need}px`;
            if (need <= 0) {
                spacer.remove();
                target.removeEventListener('scroll', shrink);
            }
        };
        // Слушать начинаем после анимации: пока блок схлопывается, пересчёт решил бы,
        // что распорка не нужна. Слушатель живёт дольше эффекта — распорка должна
        // растаять, даже если строку снова открыли.
        window.setTimeout(() => {
            target.addEventListener('scroll', shrink, { passive: true });
        }, ANIM_MS + 50);
    }, [isOpen, itemRef, contentRef]);
}
