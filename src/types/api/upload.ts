import { Track } from '@/store/entities/track';
import { YouTubeTrack } from './youtube';
import { TrackThumbProps } from '@/router/shared/track/TrackSmallThumb';
import { User } from '@/store/entities/user';
import { ReactNode } from 'react';
import { Mashup } from '@/store/entities/mashup';

export interface GenresResponse {
    response: string[];
}

export interface UploadMashupResponse {
    response?: Mashup;
}

export interface UploadMashupRequestBody {
    tracks: number[];
    tracksUrls: string[];
}

export enum TrackType {
    SmashUp,
    YouTube,
    YandexMusic
}

export interface SelectedTrack {
    key: unknown;
    keyType: TrackType;
    addToBody: (body: UploadMashupRequestBody) => void;
}

export class SmashUpSelectedTrack implements SelectedTrack {
    track: Track;
    key: number;
    keyType: TrackType;
    constructor(track: Track) {
        this.track = track;
        this.key = track.id;
        this.keyType = TrackType.SmashUp;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.tracks.push(this.track.id);
    }
}

export class YouTubeSelectedTrack implements SelectedTrack {
    track: YouTubeTrack;
    key: string;
    keyType: TrackType;
    constructor(track: YouTubeTrack) {
        this.track = track;
        this.key = track.link;
        this.keyType = TrackType.YouTube;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.tracksUrls.push(this.key);
    }
}

export class YandexMusicSelectedTrack implements SelectedTrack {
    track: Track;
    key: number;
    keyType: TrackType;
    constructor(track: Track) {
        this.track = track;
        this.key = track.id;
        this.keyType = TrackType.YandexMusic;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.tracksUrls.push(this.track.link);
    }
}

export interface RenderTrack extends TrackThumbProps {
    keyType: TrackType;
    key: unknown;

    icon?: ReactNode;

    statefulOnClick: (selectedTracks: SelectedTrack[]) => unknown;
}

export interface RenderUser {
    user: User;
    selected: boolean;

    statefulOnClick: (selectedUsers: User[]) => unknown;
}

export interface SearchTrack {
    key: unknown;
    keyType: TrackType;
    track: Track;
}

export function areTracksEqual(l: SelectedTrack, r: SelectedTrack) {
    return l.keyType === r.keyType && l.key === r.key;
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
