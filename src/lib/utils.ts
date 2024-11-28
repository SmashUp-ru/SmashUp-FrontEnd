import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function msToMinutesAndSeconds(ms: number) {
    const date = new Date(ms);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

export function getToken(): string | null {
    return sessionStorage.getItem('smashup_token') || localStorage.getItem('smashup_token');
}
