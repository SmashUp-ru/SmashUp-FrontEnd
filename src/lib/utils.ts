import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { getToken } from '@/store/profile.ts';

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
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
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
