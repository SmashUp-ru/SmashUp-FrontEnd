import { YouTubeOEmbedResponse, YouTubeTrack } from '@/router/shared/types/youtube';
import axios, { AxiosResponse } from 'axios';

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
                let author = r.data.author_name;
                if (author.endsWith(' - Topic')) {
                    author = author.slice(0, -' - Topic'.length);
                }
                data = [author.trim(), title.trim()];
            } else {
                data = [data[0].trim(), data[1].trim()];
            }

            return {
                id: link,
                authors: [data[0]],
                name: data[1],
                imageUrl: r.data.thumbnail_url,
                link: link
            };
        })
        .catch(() => {
            return {
                id: link,
                authors: ['???'],
                name: link,
                imageUrl: '',
                link: link
            };
        });
}
