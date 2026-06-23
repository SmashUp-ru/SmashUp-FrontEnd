import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { VkMashup } from './entities/vkMashup';
import { LoopMode } from '@/lib/types.ts';

/**
 * Состояние стора плеера.
 *
 * В сторе сосуществуют ТРИ независимых источника воспроизведения, у каждого
 * свой флаг проигрывания и своя пара src/isPlaying:
 *  - `queue` (`isPlaying`)               — обычное прослушивание (очередь мешапов);
 *  - `moderationSrc` (`moderationIsPlaying`) — превью неопубликованного мешапа в модерации;
 *  - `vkMashupSrc` (`vkMashupIsPlaying`)     — превью VK-импортированного аудио до загрузки.
 * Каждый источник рендерится своим `PlayerBar*` и сам прячется, когда неактивен.
 * Громкость (`volume`) при этом общая на все три источника.
 */
interface PlayerState {
    /** Идёт ли воспроизведение основной очереди. Эфемерно — НЕ персистится. */
    isPlaying: boolean;
    updatePlaying: (newIsPlaying: boolean) => void;
    play: () => void;
    stop: () => void;

    /** Текущая очередь — массив id мешапов в порядке проигрывания (учитывает shuffle). */
    queue: number[];
    updateQueue: (newQueue: number[]) => void;
    /** Очередь до перемешивания — нужна, чтобы восстановить порядок при выключении shuffle. */
    originalQueue: number[];
    updateOriginalQueue: (newOriginalQueue: number[]) => void;
    /** Индекс текущего трека в `queue`; `-1` означает «ничего не выбрано». */
    queueIndex: number;
    updateQueueIndex: (newQueueIndex: number) => void;
    /** Человекочитаемое название источника очереди (для подписи в баре). */
    queueName: string;
    updateQueueName: (newQueueName: string) => void;
    /**
     * Строковый идентификатор источника очереди — по нему определяют, играет ли
     * сейчас именно эта сущность (чтобы не перезапускать очередь повторно).
     * Форматы: `'playlist/{id}'`, `'mashup/{id}'`, `'recomendations'` и т.п.
     */
    queueId: string;
    updateQueueId: (newQueueId: string) => void;

    /** Режим повтора: `'none'` | `'queue'` (вся очередь) | `'mashup'` (один трек). */
    loop: LoopMode;
    updateLoop: (newLoop: LoopMode) => void;

    /** Включено ли перемешивание; при включении `queue` тасуется, оригинал хранится в `originalQueue`. */
    shuffle: boolean;
    updateShuffle: (newShuffle: boolean) => void;

    /** Громкость 0..1, общая для всех трёх источников воспроизведения. */
    volume: number;
    updateVolume: (newVolume: number) => void;

    /** Текущая позиция воспроизведения в секундах (опрашивается раз в 500мс). Эфемерно — НЕ персистится. */
    seek: number;
    updateSeek: (newSeek: number) => void;
    /** Целевая позиция перемотки: запись сюда заставляет Howler сделать seek. Эфемерно. */
    changedSeek: number;
    updateChangedSeek: (newChangedSeek: number) => void;

    /** Открыта ли side-панель с информацией о мешапе (`MashupInfo`). */
    info: boolean;
    updateInfo: (newInfo: boolean) => void;

    /** id мешапа, чья инфа показана в панели `MashupInfo`; `null` — панель пуста. */
    mashupInfo: null | number;
    updateMashupInfo: (newMashupInfo: null | number) => void;

    /** Полноэкранный плеер на мобайле (эфемерно, не персистится). */
    fullPlayer: boolean;
    updateFullPlayer: (newFullPlayer: boolean) => void;

    /** Источник превью модерации; `null` — бар модерации скрыт. Эфемерно — НЕ персистится. */
    moderationSrc: UnpublishedMashup | null;
    updateModerationSrc: (newModerationSrc: null | UnpublishedMashup) => void;
    /** Играет ли превью модерации (свой флаг, отдельный от `isPlaying`). */
    moderationIsPlaying: boolean;
    updateModerationIsPlaying: (newModerationIsPlaying: boolean) => void;

    /** Источник превью VK-аудио; `null` — VK-бар скрыт. Эфемерно — НЕ персистится. */
    vkMashupSrc: VkMashup | null;
    updateVkMashupSrc: (newVkMashupSrc: null | VkMashup) => void;
    /** Играет ли превью VK-аудио (свой флаг, отдельный от `isPlaying`). */
    vkMashupIsPlaying: boolean;
    updateVkMashupIsPlaying: (newVkMashupIsPlaying: boolean) => void;
}

/**
 * Zustand-стор плеера (persist, ключ `'player-storage'`).
 *
 * Держит состояние всех трёх источников воспроизведения (очередь / модерация / VK)
 * — см. {@link PlayerState}. Через `partialize` на диск попадают только данные
 * самой очереди и пользовательские предпочтения:
 * `queue`, `originalQueue`, `queueIndex`, `queueName`, `queueId`, `info`,
 * `mashupInfo`, `volume`, `shuffle`, `loop`.
 *
 * Эфемерные поля НЕ персистятся намеренно (после перезагрузки воспроизведение
 * не возобновляется само): `isPlaying`/`seek`/`changedSeek`, `fullPlayer`,
 * а также оба превью-источника `moderationSrc`/`vkMashupSrc` с их флагами.
 */
export const usePlayerStore = create<PlayerState>()(
    persist(
        (set): PlayerState => ({
            isPlaying: false,
            updatePlaying: (newIsPlaying: boolean) => set({ isPlaying: newIsPlaying }),
            play: () => set({ isPlaying: true }),
            stop: () => set({ isPlaying: false }),

            queue: [],
            updateQueue: (newQueue: number[]) => set({ queue: newQueue }),
            originalQueue: [],
            updateOriginalQueue: (newOriginalQueue: number[]) =>
                set({ originalQueue: newOriginalQueue }),
            queueIndex: -1,
            updateQueueIndex: (newQueueIndex: number) => set({ queueIndex: newQueueIndex }),
            queueName: '',
            updateQueueName: (newQueueName: string) => set({ queueName: newQueueName }),
            queueId: '',
            updateQueueId: (newQueueId: string) => set({ queueId: newQueueId }),

            loop: 'none',
            updateLoop: (newLoop: LoopMode) => set({ loop: newLoop }),

            shuffle: false,
            updateShuffle: (newShuffle: boolean) => set({ shuffle: newShuffle }),

            volume: 0.5,
            updateVolume: (newVolume: number) => set({ volume: newVolume }),

            seek: 0,
            updateSeek: (newSeek: number) => set({ seek: newSeek }),
            changedSeek: 0,
            updateChangedSeek: (newChangedSeek: number) => set({ changedSeek: newChangedSeek }),

            info: false,
            updateInfo: (newInfo: boolean) => set({ info: newInfo }),

            mashupInfo: null,
            updateMashupInfo: (newMashupInfo: null | number) => set({ mashupInfo: newMashupInfo }),

            fullPlayer: false,
            updateFullPlayer: (newFullPlayer: boolean) => set({ fullPlayer: newFullPlayer }),

            moderationSrc: null,
            updateModerationSrc: (newModerationSrc: null | UnpublishedMashup) =>
                set({ moderationSrc: newModerationSrc }),
            moderationIsPlaying: false,
            updateModerationIsPlaying: (newModerationIsPlaying: boolean) =>
                set({ moderationIsPlaying: newModerationIsPlaying }),

            vkMashupSrc: null,
            updateVkMashupSrc: (newVkMashupSrc: null | VkMashup) =>
                set({ vkMashupSrc: newVkMashupSrc }),
            vkMashupIsPlaying: false,
            updateVkMashupIsPlaying: (newVkMashupIsPlaying: boolean) =>
                set({ vkMashupIsPlaying: newVkMashupIsPlaying })
        }),
        {
            name: 'player-storage',

            partialize: (state) => ({
                queue: state.queue,
                originalQueue: state.originalQueue,
                queueIndex: state.queueIndex,
                queueName: state.queueName,
                queueId: state.queueId,

                info: state.info,
                mashupInfo: state.mashupInfo,
                volume: state.volume,
                shuffle: state.shuffle,
                loop: state.loop
            })
        }
    )
);
