import { usePlayerStore } from '@/store/player.ts';
import { shuffleQueue } from '@/lib/utils.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { VkMashup } from '@/store/entities/vkMashup';
import { useCallback } from 'react';

/**
 * Хук-фасад навигации по очереди воспроизведения.
 *
 * Возвращает набор колбэков, оборачивающих сеттеры `usePlayerStore`. Сами
 * аудио-движки (Howler, медиасессия, трекеры стримов) живут отдельно — этот хук
 * только меняет состояние очереди/индекса/флагов, движки реагируют на него.
 *
 * Важно: плеер поддерживает три **взаимоисключающих** источника звука —
 * обычная очередь (`queue`), превью модерации (`moderationSrc`) и превью VK
 * (`vkMashupSrc`). Запуск любого источника здесь гасит два других (обнуляет их
 * src и `isPlaying`), поэтому одновременно играть может только один.
 */
export function usePlayer() {
    const updatePlaying = usePlayerStore((state) => state.updatePlaying);
    const queue = usePlayerStore((state) => state.queue);
    const updateQueue = usePlayerStore((state) => state.updateQueue);
    const updateOriginalQueue = usePlayerStore((state) => state.updateOriginalQueue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const updateQueueIndex = usePlayerStore((state) => state.updateQueueIndex);
    const updateQueueName = usePlayerStore((state) => state.updateQueueName);
    const queueId = usePlayerStore((state) => state.queueId);
    const updateQueueId = usePlayerStore((state) => state.updateQueueId);
    const shuffle = usePlayerStore((state) => state.shuffle);
    const seek = usePlayerStore((state) => state.seek);
    const updateSeek = usePlayerStore((state) => state.updateSeek);
    const updateChangedSeek = usePlayerStore((state) => state.updateChangedSeek);
    const updateModerationSrc = usePlayerStore((state) => state.updateModerationSrc);
    const updateModerationIsPlaying = usePlayerStore((state) => state.updateModerationIsPlaying);
    const updateVkMashupSrc = usePlayerStore((state) => state.updateVkMashupSrc);
    const updateVkMashupIsPlaying = usePlayerStore((state) => state.updateVkMashupIsPlaying);

    const updateInfo = usePlayerStore((state) => state.updateInfo);
    const updateMashupInfo = usePlayerStore((state) => state.updateMashupInfo);

    /**
     * Возобновить/запустить воспроизведение текущего трека очереди
     * (выставляет только флаг `isPlaying`, ничего не перематывает).
     */
    const play = useCallback(() => {
        updatePlaying(true);
    }, [updatePlaying]);

    /** Поставить воспроизведение на паузу (сбрасывает только флаг `isPlaying`). */
    const pause = useCallback(() => {
        updatePlaying(false);
    }, [updatePlaying]);

    /**
     * Перейти к следующему треку. Всегда перематывает текущий в начало
     * (`seek = 0`), затем ветвится по режиму `loop`:
     * - `mashup` — повтор текущего трека: остаёмся на месте и просто играем заново;
     * - иначе, если есть следующий трек — сдвигаем индекс вперёд;
     * - `queue` (и трек был последним) — заворачиваем на индекс 0 и играем;
     * - `none` (и трек был последним) — очередь кончилась, ставим на паузу.
     *
     * `loop` читается через `getState()`, а не из замыкания, чтобы избежать
     * устаревшего значения и лишних пересозданий колбэка.
     */
    const next = useCallback(() => {
        const currentLoop = usePlayerStore.getState().loop;
        updateSeek(0);
        updateChangedSeek(0);

        if (currentLoop === 'mashup') {
            play();
        } else if (queueIndex < queue.length - 1) {
            updateQueueIndex(queueIndex + 1);
        } else if (currentLoop === 'queue') {
            updateQueueIndex(0);
            play();
        } else if (currentLoop === 'none') {
            pause();
        }
    }, [pause, play, queue.length, queueIndex, updateChangedSeek, updateQueueIndex, updateSeek]);

    /**
     * Перейти к предыдущему треку — с привычным поведением «двойного назначения»:
     * - если проиграно больше 5 секунд (`seek > 5000`), кнопка перематывает
     *   **текущий** трек в начало (пауза + `seek = 0`), а не уходит назад;
     * - иначе (в первые 5 секунд) переходим к предыдущему треку, если он есть;
     *   при `loop === 'mashup'` на первом треке — играем текущий заново;
     *   иначе на первом треке — ставим на паузу.
     */
    const prev = useCallback(() => {
        const currentLoop = usePlayerStore.getState().loop;

        if (seek > 1000 * 5) {
            pause();
            updateSeek(0);
            updateChangedSeek(0);
        } else {
            if (queueIndex > 0) {
                updateQueueIndex(queueIndex - 1);
            } else if (currentLoop === 'mashup') {
                play();
            } else {
                pause();
            }
        }
    }, [pause, play, queueIndex, seek, updateChangedSeek, updateQueueIndex, updateSeek]);

    /**
     * Запустить новую очередь (плейлист/альбом/подборку) с указанной позиции.
     *
     * Если `newQueueId` совпадает с уже активной очередью — повторного набора
     * очереди не происходит, просто продолжаем играть (`play()`); это и делает
     * кнопку Play на уже играющей сущности идемпотентной. Иначе гасим источники
     * модерации и VK, сохраняем «оригинальную» (нешафленную) очередь в
     * `originalQueue` и — при включённом `shuffle` — подменяем рабочую очередь
     * перемешанной так, чтобы выбранный трек оказался первым.
     *
     * @param newQueueIndex стартовый индекс в очереди (по умолчанию 0).
     */
    const playQueue = useCallback(
        (
            newQueue: number[],
            newQueueName: string,
            newQueueId: string,
            newQueueIndex: number = 0
        ) => {
            if (newQueue.length === 0) return;

            if (newQueueId === queueId) {
                play();
            } else {
                updateModerationSrc(null);
                updateModerationIsPlaying(false);

                updateVkMashupSrc(null);
                updateVkMashupIsPlaying(false);

                updateSeek(0);
                updateChangedSeek(0);

                updateOriginalQueue(newQueue);

                let shuffledQueue = newQueue;
                if (shuffle) {
                    [shuffledQueue] = shuffleQueue(newQueue, newQueueIndex);
                }

                updateQueueId(newQueueId);
                updateQueue([...shuffledQueue]);
                updateQueueIndex(newQueueIndex);
                updateQueueName(newQueueName);
                play();
            }
        },
        [
            play,
            queueId,
            shuffle,
            updateChangedSeek,
            updateModerationIsPlaying,
            updateModerationSrc,
            updateOriginalQueue,
            updateQueue,
            updateQueueId,
            updateQueueIndex,
            updateQueueName,
            updateSeek,
            updateVkMashupIsPlaying,
            updateVkMashupSrc
        ]
    );

    /**
     * Запустить конкретный мешап внутри очереди.
     *
     * В отличие от {@link playQueue}, идемпотентность проверяется по паре
     * (`queueId` + `queueIndex`): нажатие Play на уже играющем мешапе той же
     * очереди лишь продолжает воспроизведение. Иначе гасим модерацию/VK и
     * заново набираем очередь; при `shuffle` `shuffleQueue` перемешивает список
     * **и пересчитывает** `newQueueIndex`, чтобы выбранный мешап остался текущим.
     */
    const playMashup = useCallback(
        (newQueue: number[], newQueueName: string, newQueueId: string, newQueueIndex: number) => {
            if (newQueueId === queueId && queueIndex === newQueueIndex) {
                play();
            } else {
                updateModerationSrc(null);
                updateModerationIsPlaying(false);

                updateVkMashupSrc(null);
                updateVkMashupIsPlaying(false);

                updateSeek(0);
                updateChangedSeek(0);

                updateOriginalQueue(newQueue);

                if (shuffle) {
                    [newQueue, newQueueIndex] = shuffleQueue(newQueue, newQueueIndex);
                }

                updateQueueId(newQueueId);

                updateQueue([...newQueue]);
                updateQueueIndex(newQueueIndex);
                updateQueueName(newQueueName);
                play();
            }
        },
        [
            play,
            queueId,
            queueIndex,
            shuffle,
            updateChangedSeek,
            updateModerationIsPlaying,
            updateModerationSrc,
            updateOriginalQueue,
            updateQueue,
            updateQueueId,
            updateQueueIndex,
            updateQueueName,
            updateSeek,
            updateVkMashupIsPlaying,
            updateVkMashupSrc
        ]
    );

    /**
     * Запустить превью неопубликованного мешапа в режиме модерации.
     *
     * Полностью выключает обычную очередь (обнуляет queue/index/id/name) и
     * закрывает панели info, затем активирует источник `moderationSrc` и гасит
     * источник VK — три источника звука взаимоисключающи.
     */
    const playModerationMashup = useCallback(
        (mashup: UnpublishedMashup) => {
            updateOriginalQueue([]);
            updateQueueId('');
            updateQueue([]);
            updateQueueIndex(-1);
            updateQueueName('');
            updateSeek(0);
            updateChangedSeek(0);
            updateInfo(false);
            updateMashupInfo(null);

            updateModerationSrc(mashup);
            updateModerationIsPlaying(true);

            updateVkMashupSrc(null);
            updateVkMashupIsPlaying(false);
        },
        [
            updateChangedSeek,
            updateInfo,
            updateMashupInfo,
            updateModerationIsPlaying,
            updateModerationSrc,
            updateOriginalQueue,
            updateQueue,
            updateQueueId,
            updateQueueIndex,
            updateQueueName,
            updateSeek,
            updateVkMashupIsPlaying,
            updateVkMashupSrc
        ]
    );

    /**
     * Запустить превью импортированного из VK аудио (перед загрузкой мешапа).
     *
     * Зеркально {@link playModerationMashup}: очищает обычную очереди и панели
     * info, активирует источник `vkMashupSrc` и гасит модерацию.
     */
    const playVkMashup = useCallback(
        (mashup: VkMashup) => {
            updateOriginalQueue([]);
            updateQueueId('');
            updateQueue([]);
            updateQueueIndex(-1);
            updateQueueName('');
            updateSeek(0);
            updateChangedSeek(0);
            updateInfo(false);
            updateMashupInfo(null);

            updateModerationSrc(null);
            updateModerationIsPlaying(false);

            updateVkMashupSrc(mashup);
            updateVkMashupIsPlaying(true);
        },
        [
            updateChangedSeek,
            updateInfo,
            updateMashupInfo,
            updateModerationIsPlaying,
            updateModerationSrc,
            updateOriginalQueue,
            updateQueue,
            updateQueueId,
            updateQueueIndex,
            updateQueueName,
            updateSeek,
            updateVkMashupIsPlaying,
            updateVkMashupSrc
        ]
    );

    /**
     * Открыть панель инфо для конкретного мешапа по id. Взаимоисключающа с
     * панелью текущего трека: выставляет `mashupInfo` и сбрасывает `info`.
     */
    const openMashupInfo = useCallback(
        (mashupId: number) => {
            updateInfo(false);
            updateMashupInfo(mashupId);
        },
        [updateInfo, updateMashupInfo]
    );

    /**
     * Открыть панель инфо текущего играющего трека. Взаимоисключающа с
     * {@link openMashupInfo}: выставляет `info` и сбрасывает `mashupInfo`.
     */
    const openInfo = useCallback(() => {
        updateInfo(true);
        updateMashupInfo(null);
    }, [updateInfo, updateMashupInfo]);

    /** Закрыть обе панели инфо (`info` и `mashupInfo`). */
    const closeInfo = useCallback(() => {
        updateInfo(false);
        updateMashupInfo(null);
    }, [updateInfo, updateMashupInfo]);

    return {
        play,
        pause,
        next,
        prev,
        playQueue,
        playMashup,
        openMashupInfo,
        openInfo,
        closeInfo,
        playModerationMashup,
        playVkMashup
    };
}
