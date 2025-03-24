import { AxiosError, AxiosResponse } from 'axios';

export interface SmashUpResponse<T> {
    message?: string;
    response: T;
}

export type AxiosSmashUpResponse<T> = AxiosResponse<SmashUpResponse<T>>;
export type AxiosSmashUpError<T> = AxiosError<SmashUpResponse<T>>;
