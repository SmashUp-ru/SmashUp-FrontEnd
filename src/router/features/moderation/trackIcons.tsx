import { ReactNode } from 'react';
import { TrackType } from '@/router/shared/types/upload.ts';
import { SmashUpIcon } from '@/components/icons/SmashUp.tsx';
import YouTubeIcon from '@/components/icons/YouTube.tsx';
import YandexMusicIcon from '@/components/icons/YandexMusic.tsx';
import SpotifyIcon from '@/components/icons/Spotify.tsx';

/** Иконка источника трека в списках модерации. */
export const TRACK_ICON: Record<TrackType, ReactNode> = {
    [TrackType.SmashUp]: <SmashUpIcon />,
    [TrackType.YouTube]: <YouTubeIcon />,
    [TrackType.YandexMusic]: <YandexMusicIcon />,
    [TrackType.Spotify]: <SpotifyIcon />
};
