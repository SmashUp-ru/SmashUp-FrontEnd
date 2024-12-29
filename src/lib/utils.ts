import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { getToken } from '@/store/global.ts';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function msToMinutesAndSeconds(ms: number) {
    const date = new Date(ms);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

export const axiosSession = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

axiosSession.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
});

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

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function zip(rows: any[][]) {
    return rows[0].map((_, c) => rows.map((row) => row[c]));
}

export function declOfNum(n: number, titles: string[]) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[n % 100 > 4 && n % 100 < 20 ? 2 : cases[n % 10 < 5 ? n % 10 : 5]];
}

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
    predicate: (item: T, toRemove: T) => unknown = (l, r) => l === r
): T[] {
    let index = 0;
    for (const element of array) {
        if (predicate(element, item)) {
            const newArray = [...array];
            newArray.splice(index, 1);
            return newArray;
        }
        index++;
    }
    return array;
}

export function maskEmail(email: string): string {
    const [local, domain] = email.split('@');

    if (local.length <= 2) {
        return email;
    }

    const maskedLocal = local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
    return `${maskedLocal}@${domain}`;
}
