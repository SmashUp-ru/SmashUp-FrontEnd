import { Track } from '@/store/entities/track';
import { YouTubeTrack } from './youtube';
import { TrackThumbProps } from '@/router/shared/track/TrackSmallThumb';
import { User } from '@/store/entities/user';
import { ReactNode } from 'react';

export interface GenresResponse {
    response: string[];
}

export interface UploadMashupRequestBody {
    tracks: number[];
    trackUrls: string[];
}

export interface SelectedTrack {
    key: unknown;
    addToBody: (body: UploadMashupRequestBody) => void;
}

export class SmashUpSelectedTrack implements SelectedTrack {
    track: Track;
    key: number;
    constructor(track: Track) {
        this.track = track;
        this.key = track.id;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.tracks.push(this.track.id);
    }
}

export class YouTubeSelectedTrack implements SelectedTrack {
    track: YouTubeTrack;
    key: string;
    constructor(track: YouTubeTrack) {
        this.track = track;
        this.key = track.link;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.trackUrls.push(this.key);
    }
}

export class YandexMusicSelectedTrack implements SelectedTrack {
    track: Track;
    link: string;
    key: string;
    constructor(link: string) {
        this.track = {
            id: link as unknown,
            name: link,
            authors: ['???'],
            imageUrl:
                'https://store-images.s-microsoft.com/image/apps.2465.13510798882805719.3f5d017d-a79f-4f62-ad22-aee707e0ebd0.0620b3ee-ff33-447a-b654-eaa47d20d4a6',
            link: link
        } as Track;
        this.link = link;
        this.key = link;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.trackUrls.push(this.link);
    }
}

export interface RenderTrack extends TrackThumbProps {
    keyType: string;
    key: unknown;

    icon?: ReactNode;

    statefulOnClick: (selectedTracks: SelectedTrack[]) => unknown;
}

export interface RenderUser {
    user: User;
    selected: boolean;

    statefulOnClick: (selectedUsers: User[]) => unknown;
}

export function areTracksEqual(l: SelectedTrack, r: SelectedTrack) {
    return l.constructor.name === r.constructor.name && l.key === r.key;
}

export function isTrackSelected(track: SelectedTrack, selectedTracks: SelectedTrack[]) {
    for (const selectedTrack of selectedTracks) {
        if (areTracksEqual(selectedTrack, track)) {
            return true;
        }
    }

    return false;
}

export function areUsersEqual(l: User, r: User) {
    return l.id === r.id;
}

export function isUserSelected(user: User, selectedUsers: User[]) {
    for (const selectedUser of selectedUsers) {
        if (areUsersEqual(selectedUser, user)) {
            return true;
        }
    }

    return false;
}
