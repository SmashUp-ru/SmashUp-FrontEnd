import { useEffect, useState } from 'react';
import { usePlaylistStore } from '@/store/entities/playlist.ts';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { coverUrl } from '@/lib/cdn.ts';
import LogoIcon from '@/components/icons/Logo.tsx';
import { cn } from '@/lib/utils.ts';

const UNIQUE = 24;
// С запасом: после удаления повторов обложек остаётся меньше. 96 — один батч (лимит 100).
const FETCH = 96;
// Плейлист 1 = «Новинки»: свежие мешапы, обложки меняются сами по мере загрузок.
const NEW_RELEASES_ID = 1;
const COLUMNS = 6;
const PER_COLUMN = 8;

/** Грузит картинку целиком; резолвится src или null, если не загрузилась. */
function preload(src: string) {
    return new Promise<string | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

/**
 * Левая половина экранов входа/регистрации: наклонная стена из обложек свежих
 * мешапов, колонки едут навстречу друг другу. Пока ВСЕ обложки не скачаны,
 * виден только знак SmashUp — стена появляется целиком, без дыр и скелетонов.
 */
export default function CoverWall() {
    const getPlaylist = usePlaylistStore((s) => s.getOneById);
    const getMashups = useMashupStore((s) => s.getManyByIds);
    const [covers, setCovers] = useState<string[] | null>(null);

    useEffect(() => {
        let alive = true;
        getPlaylist(NEW_RELEASES_ID)
            .then((p) => getMashups(p.mashups.slice(0, FETCH)))
            .then((mashups) => {
                // У одного автора часто одна обложка на серию — повторы стену не украшают.
                const unique = [...new Set(mashups.map((m) => m.imageUrl))].slice(0, UNIQUE);
                return Promise.all(unique.map((u) => preload(coverUrl('mashup', u, 400))));
            })
            .then((srcs) => alive && setCovers(srcs.filter((s): s is string => s !== null)))
            .catch(() => alive && setCovers([]));
        return () => {
            alive = false;
        };
    }, [getPlaylist, getMashups]);

    const ready = covers !== null && covers.length > 0;

    return (
        // Десктоп: левая половина экрана. Мобайл: фон на весь экран ПОД формой —
        // размыт и затемнён, чтобы поля читались.
        <div
            className='fixed inset-0 lg:relative lg:inset-auto lg:w-1/2 lg:shrink-0 overflow-hidden bg-background [perspective:1400px]'
            aria-hidden
        >
            {ready && (
                <div
                    className='absolute inset-[-25%] flex gap-3 max-lg:blur-md animate-in fade-in [animation-duration:700ms]'
                    style={{ transform: 'rotateX(22deg) rotateZ(-14deg)' }}
                >
                    {Array.from({ length: COLUMNS }, (_, c) => {
                        // Каждая колонка — свой сдвиг по списку, чтобы соседи не совпадали.
                        const column = Array.from(
                            { length: PER_COLUMN },
                            (_, i) => covers[(c * 5 + i) % covers.length]
                        );
                        return (
                            <div
                                key={c}
                                // Мобайл — стоп: блюр по движущемуся слою пересчитывается каждый кадр
                                // и сажает батарею, а под размытием движение почти не видно.
                                className='flex-1 flex flex-col gap-3 animate-wall motion-reduce:[animation-play-state:paused] max-lg:[animation-play-state:paused]'
                                style={{
                                    animationDuration: `${70 + (c % 3) * 15}s`,
                                    animationDirection: c % 2 ? 'reverse' : 'normal'
                                }}
                            >
                                {/* Список дважды: сдвиг на -50% возвращает колонку в начало без шва. */}
                                {[...column, ...column].map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        alt=''
                                        draggable={false}
                                        className='aspect-square w-full rounded-xl object-cover'
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
            {/* Нейтральная растяжка снизу: обложки уходят в фон, знак читается. */}
            <div className='hidden lg:block absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/0' />
            {/* Правый край растворяется в фоне формы, а не обрезается по шву. */}
            <div className='hidden lg:block absolute inset-y-0 right-0 w-1/5 bg-gradient-to-r from-background/0 to-background' />
            {/* Мобайл: затемнение под формой. */}
            <div className='lg:hidden absolute inset-0 bg-background/80' />
            {/*
              Один и тот же знак: место — в углу (left/bottom 48px), а пока грузится,
              он сдвинут transform-ом в центр панели. Панель = 50vw × 100dvh, знак
              134×68, поэтому до центра: x = 25vw − 48 − 67, y = −(50dvh − 48 − 34).
              Готово → сдвиг снимается, знак съезжает в угол по пружине (transform,
              не left/bottom — без перерасчёта раскладки). Пульс — на вложенном
              элементе (свойство scale), чтобы не спорить со сдвигом.
            */}
            <div
                className='hidden lg:block absolute left-12 bottom-12 transition-transform [transition-duration:900ms] ease-spring motion-reduce:transition-none'
                style={{
                    transform: ready
                        ? 'translate(0, 0)'
                        : 'translate(calc(25vw - 115px), calc(-50dvh + 82px))'
                }}
            >
                <div
                    className={cn(
                        // Пульс только пока реально ждём; API упал — просто знак по центру.
                        covers === null && 'animate-logo-pulse motion-reduce:animate-none'
                    )}
                >
                    <LogoIcon color='primary' width={134} height={68} />
                </div>
            </div>
        </div>
    );
}
