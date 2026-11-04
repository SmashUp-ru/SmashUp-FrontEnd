/**
 * «+ Жанр» — той же формы, что чип жанра (h-8, rounded-xl, px-3, 13px), но с плюсом
 * и приглушённым текстом: читается как «ещё один такой же», а не как отдельный блок.
 */
export const ADD_GENRE_CHIP =
    'group inline-flex items-center gap-1.5 h-8 rounded-xl bg-surface px-3 text-[13px] font-medium text-onSurfaceVariant hover:bg-onSurface/10 hover:text-onSurface transition-colors motion-reduce:transition-none';

/** Чип жанра в раскрытой строке модерации. */
export const GENRE_CHIP =
    'inline-flex h-8 items-center rounded-xl bg-surface px-3 text-[13px] font-medium text-onSurface first-letter:uppercase';

/** Подпись поля в раскрытой строке модерации — одна на все колонки. */
export const FIELD_LABEL = 'text-[13px] font-medium text-onSurfaceVariant';
