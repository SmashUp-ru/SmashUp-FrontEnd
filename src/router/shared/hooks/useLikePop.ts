import { useEffect, useRef, useState } from 'react';

/**
 * Возвращает `true` коротко после того, как `liked` стал `true` по действию
 * пользователя (false → true), но НЕ на первичном маунте уже-лайкнутого мешапа.
 *
 * Нужен для «поп»-анимации сердечка: без этого `animate-pop` срабатывал бы при
 * маунте каждого залитого сердечка, и при загрузке списка все лайкнутые мешапы
 * «прыгали» разом (выглядит как глитч).
 */
export function useLikePop(liked: boolean): boolean {
    const prev = useRef(liked);
    const [pop, setPop] = useState(false);

    useEffect(() => {
        if (liked && !prev.current) setPop(true);
        prev.current = liked;
    }, [liked]);

    useEffect(() => {
        if (!pop) return;
        const t = setTimeout(() => setPop(false), 320);
        return () => clearTimeout(t);
    }, [pop]);

    return pop;
}
