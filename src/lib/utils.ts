import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { getToken, useGlobalStore } from '@/store/global.ts';

/**
 * Объединяет Tailwind-классы с разрешением конфликтов: clsx собирает условные
 * классы, twMerge оставляет последний из конфликтующих (например `p-2 p-4` → `p-4`).
 * Без twMerge переопределить класс пропсом было бы нельзя — оба остались бы в строке.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Форматирует длительность в миллисекундах как `M:SS` (например `3:07`).
 * Минуты НЕ обнуляются на границе часа: для треков >= 60 мин выводится 60+, а не
 * остаток. См. комментарий ниже про отказ от `new Date(ms).getMinutes()`.
 */
export function msToMinutesAndSeconds(ms: number) {
    // Math.floor вместо new Date(ms).getMinutes(): getMinutes() обнуляется на границе
    // часа (теряет часы для длительностей >= 60 мин) и зависит от часового пояса.
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

/**
 * Единый axios-инстанс для всех HTTP-запросов приложения.
 * `baseURL` берётся из `VITE_BACKEND_URL` (без него каждый URL станет `undefined/...`).
 * Интерсепторы ниже навешивают Bearer-токен на запрос и авто-логаут на 401 на ответ —
 * поэтому ходить мимо `axiosSession` (через голый axios) нельзя, иначе потеряем авторизацию.
 */
export const axiosSession = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

/**
 * Request-интерсептор: подставляет `Authorization: Bearer <токен>` в КАЖДЫЙ запрос.
 * Токен читается заново через `getToken()` на каждый запрос (не кешируется), чтобы
 * после логина/логаута сразу использовалось актуальное значение. Для гостя токен
 * пустой — заголовок уходит как `Bearer ` (бэкенд трактует как неавторизованного).
 */

axiosSession.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
});

// 401 = протухший/невалидный токен → разлогиниваем и уводим на /login.
// Срабатывает только если токен БЫЛ (у гостя 401 на защищённом эндпоинте ожидаем).
// 403 НЕ обрабатываем: это «нет прав»/бан/неверный пароль — пользователь остаётся в сессии.
// Жёсткий переход через window.location полностью сбрасывает in-memory состояние.
axiosSession.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && getToken()) {
            localStorage.removeItem('smashup_token');
            sessionStorage.removeItem('smashup_token');
            useGlobalStore.getState().updateToken('');

            const onAuthPage = ['/login', '/register', '/user/recover_password'].some((path) =>
                window.location.pathname.startsWith(path)
            );
            if (!onAuthPage) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Перемешивает очередь (Фишер–Йейтс) и одновременно «ведёт» индекс текущего трека,
 * возвращая его новую позицию. Это позволяет включить shuffle, не прерывая
 * воспроизведение: трек остаётся тем же, меняется лишь его место в массиве.
 * @returns кортеж `[перемешанная очередь, новый индекс текущего трека]`.
 */
export function shuffleQueue(queue: number[], indexInQueue: number): [number[], number] {
    const shuffledQueue = [...queue];
    let targetNewIndex = indexInQueue;

    for (let i = shuffledQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        if (i === targetNewIndex) {
            targetNewIndex = j;
        } else if (j === targetNewIndex) {
            targetNewIndex = i;
        }

        [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
    }

    return [shuffledQueue, targetNewIndex];
}

/**
 * Транспонирует массив рядов в массив колонок: `[[a,b],[1,2]]` → `[[a,1],[b,2]]`.
 * Длина результата равна длине ПЕРВОГО ряда (`rows[0]`) — более длинные ряды
 * обрезаются, более короткие дадут `undefined`. Используется для склейки
 * параллельных массивов (например `zip([authorsIds, authors])`); из-за
 * разнородных типов сигнатура осталась `any[][]`.
 */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function zip(rows: any[][]) {
    return rows[0].map((_, c) => rows.map((row) => row[c]));
}

/**
 * Выбирает правильную форму русского слова по числу (склонение для счётных конструкций).
 * `titles` — три формы для [1, 2, 5]: например `['лайк', 'лайка', 'лайков']`
 * → 1 лайк, 2 лайка, 5 лайков. Особый случай 11–14 (и любые `…11`–`…14`) даёт
 * форму «лайков», поэтому проверка идёт по `n % 100`, а не только по `n % 10`.
 */
export function declOfNum(n: number, titles: string[]) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[n % 100 > 4 && n % 100 < 20 ? 2 : cases[n % 10 < 5 ? n % 10 : 5]];
}

/**
 * Проверяет, что изображение по ссылке/data-URL не меньше `minSize` по обеим сторонам.
 * Резолвится в `false` при ошибке загрузки. Используется для блокировки сабмита форм
 * до отправки запроса (см. AddPlaylistDialog, MashupForm).
 */
export function validateImageDimensions(src: string, minSize: number): Promise<boolean> {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () =>
            resolve(image.naturalWidth >= minSize && image.naturalHeight >= minSize);
        image.onerror = () => resolve(false);
        image.src = src;
    });
}

/**
 * Читает файл как data-URL (`data:<mime>;base64,<данные>`) через FileReader.
 * Важно: возвращается ПОЛНЫЙ data-URL с префиксом — перед отправкой на бэкенд
 * вызывающий код обязан срезать `data:…;base64,` (бэкенд ждёт чистый base64).
 */
export function convertToBase64(file: File): Promise<string | null | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}

export function trim(str: string) {
    return str.replace(/^\s+|\s+$/g, '');
}

export function removeItem<T>(
    array: T[],
    item: T,
    predicate: (item: T, toRemove: T) => unknown = (l, r) => l === r,
    direct: boolean = false
): T[] {
    let index = 0;
    for (const element of array) {
        if (predicate(element, item)) {
            const newArray = direct ? array : [...array];
            newArray.splice(index, 1);
            return newArray;
        }
        index++;
    }
    return array;
}

export function replaceItem<T>(
    array: T[],
    newItem: T,
    predicate: (item: T) => unknown,
    direct: boolean = false
): T[] {
    let index = 0;
    for (const element of array) {
        if (predicate(element)) {
            const newArray = direct ? array : [...array];
            newArray[index] = newItem;
            return newArray;
        }
        index++;
    }
    return array;
}

/**
 * Маскирует локальную часть email для показа в UI: оставляет первый и последний
 * символ, остальное заменяет звёздочками (`john@x.ru` → `j**n@x.ru`). Домен не
 * скрывается. Короткий локальный фрагмент (<= 2 символов) возвращается как есть —
 * скрывать там нечего, маска лишь раскрыла бы и так известные символы.
 */
export function maskEmail(email: string): string {
    const [local, domain] = email.split('@');

    if (local.length <= 2) {
        return email;
    }

    const maskedLocal = local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
    return `${maskedLocal}@${domain}`;
}
