/**
 * Одноразово проигрывает keyframe-класс на элементе.
 *
 * Запускаем по КЛИКУ, а не через :active — иначе на tap-to-click тачпада
 * удержание ~нулевое и отклик не виден. Reflow перед добавлением класса
 * перезапускает анимацию при частых кликах; под prefers-reduced-motion
 * гасится `motion-reduce:animate-none`.
 */
export function playOnce(el: HTMLElement, className: string) {
    el.classList.remove(className);
    el.getBoundingClientRect();
    el.classList.add(className, 'motion-reduce:animate-none');
    el.addEventListener(
        'animationend',
        () => el.classList.remove(className, 'motion-reduce:animate-none'),
        { once: true }
    );
}
