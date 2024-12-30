export interface YouTubeTrack {
    id: React.Key;
    authors: string[];
    name: string;
    imageUrl: string;
    link: string;
}

export interface YouTubeOEmbedResponse {
    title: string;
    thumbnail_url: string;
}
