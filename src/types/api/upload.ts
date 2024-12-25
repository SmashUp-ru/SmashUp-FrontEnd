import { Track } from '@/store/entities/track';
import { YouTubeTrack } from './youtube';
import { TrackThumbProps } from '@/router/shared/track/TrackSmallThumb';

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
    link: string;
    key: string;
    constructor(link: string) {
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

    statefulOnClick: (selectedTracks: SelectedTrack[]) => unknown;
}

export function areTracksEqual(l: SelectedTrack, r: SelectedTrack) {
    return l.constructor.name === r.constructor.name && l.key === r.key;
}

export function isSelected(track: SelectedTrack, selectedTracks: SelectedTrack[]) {
    for (const selectedTrack of selectedTracks) {
        if (
            selectedTrack.constructor.name === track.constructor.name &&
            selectedTrack.key === track.key
        ) {
            return true;
        }
    }

    return false;
}
