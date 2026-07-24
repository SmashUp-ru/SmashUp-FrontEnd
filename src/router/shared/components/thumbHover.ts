/**
 * Общие классы ховера тумб — чтобы 12 копий одного эффекта не разъезжались.
 *
 * Канон: всё, что появляется по наведению, появляется ЗА 200ms — столько же,
 * сколько затемняется обложка (`transition-opacity duration-200` на `<img>`).
 */

/** Подсветка строки/карточки под курсором. Без неё фон переключался рывком. */
export const THUMB_ROW_HOVER = 'transition-colors duration-200 motion-reduce:transition-none';

/**
 * Появление кнопки поверх обложки (play/pause, «ещё»).
 *
 * Раньше это было `md:group-hover:block` — **`display` не анимируется**, кнопка
 * возникала мгновенно посреди плавно темнеющей обложки. Теперь прячем
 * прозрачностью, а `pointer-events-none` в покое обязателен: невидимая кнопка
 * иначе перехватывала бы клики по обложке (под ней ссылка на страницу мешапа).
 *
 * `group-focus-within` — чтобы кнопка проявлялась и при переходе на неё с
 * клавиатуры: с `display:none` она вообще не попадала в таб-порядок.
 *
 * На мобайле (до `md`) элемент виден всегда — там ховера нет.
 *
 * ⚠️ Длительность задана арбитрарным `[transition-duration:200ms]`, а не
 * `duration-200`: почти все такие элементы — `Button`, а в `buttonVariants`
 * стоит `[transition-duration:150ms]`. `duration-200` с ним не конфликтует по
 * правилам tailwind-merge (разные группы), обе декларации доезжают до CSS и
 * побеждает та, что ниже в стилях, — ревил шёл 150ms против 200ms у обложки.
 * Одинаковая форма записи заставляет merge оставить одну.
 */
export const THUMB_REVEAL =
    'transition-opacity [transition-duration:200ms] motion-reduce:transition-none md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto';

/** То же, но на мобайле элемент скрыт совсем (бывшее `hidden md:group-hover:block`). */
export const THUMB_REVEAL_DESKTOP = `hidden md:block ${THUMB_REVEAL}`;
