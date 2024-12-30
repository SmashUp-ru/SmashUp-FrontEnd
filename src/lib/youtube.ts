import { YouTubeOEmbedResponse, YouTubeTrack } from '@/types/api/youtube';
import axios, { AxiosResponse } from 'axios';
import { trim } from './utils';

export async function loadOEmbed(link: string): Promise<YouTubeTrack> {
    return axios
        .get(`https://www.youtube.com/oembed?format=json&url=${link}`)
        .then((r: AxiosResponse<YouTubeOEmbedResponse>) => {
            const title = r.data.title;

            let data: string[] = [];
            for (const separator of ['-', '–', '—']) {
                data = title.split(separator, 2);
                if (data.length == 2) {
                    break;
                }
            }

            if (data.length != 2) {
                data = ['???', title];
            } else {
                data = [trim(data[0]), trim(data[1])];
            }

            return {
                id: link,
                authors: [data[0]],
                name: data[1],
                imageUrl: r.data.thumbnail_url,
                link: link
            };
        });
}
