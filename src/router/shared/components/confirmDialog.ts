/**
 * Классы диалогов подтверждения («Выйти?», «Удалить плейлист?»).
 * Базовые DialogTitle/DialogDescription несут pb-7/pt-7 под формы настроек —
 * в коротком подтверждении это давало 56px пустоты между заголовком и текстом.
 */
export const CONFIRM_DIALOG =
    'w-[calc(100vw-2rem)] max-w-[400px] rounded-[28px] p-6 gap-6 outline-none';
/** Кнопки поровну по ширине; на мобайле — столбиком, действие сверху. */
export const CONFIRM_FOOTER = 'gap-2 sm:space-x-0';
/** Нейтральная «Отмена»: серая плашка вместо фиолетовой обводки (не спорит с действием). */
export const CONFIRM_CANCEL =
    'flex-1 rounded-2xl px-4 py-[11px] font-semibold text-[15px] text-onSurface bg-onSurface/10 hover:bg-onSurface/15';

/**
 * `onOpenAutoFocus` для диалогов подтверждения: фокус на само окно, а не на первую
 * кнопку. Radix фокусирует «Отмену», а Chrome после выбора пункта меню считает
 * это клавиатурным фокусом и рисует кольцо — выглядело как обводка кнопки.
 * Фокус остаётся внутри диалога, Tab ведёт к кнопкам.
 */
export function focusDialogItself(e: Event) {
    e.preventDefault();
    (e.currentTarget as HTMLElement | null)?.focus({ preventScroll: true });
}
