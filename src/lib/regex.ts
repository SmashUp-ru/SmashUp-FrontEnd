export const RegEx = {
    USERNAME: /(?=^[а-яА-ЯёЁa-zA-Z0-9_ ]{2,32}$)(?!^\\d+$)^.+$/,
    PASSWORD: /[a-zA-Z0-9-_=+()*&^%$#@!]{8,32}/,
    EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    EMAIL_OR_USERNAME:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|(?=^[а-яА-ЯёЁa-zA-Z0-9_ ]{2,32}$)(?!^\\d+$)^.+$/,
    YOUTUBE:
        /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})(|.+)$/,

    YANDEX_MUSIC_ALBUM:
        /^(?:https?:\/\/)?(?:www\.)?music\.yandex\.(?:ru|by|kz)\/album\/(\d+)(?:|\/)$/,
    YANDEX_MUSIC_TRACK:
        /^(?:https?:\/\/)?(?:www\.)?music\.yandex\.(?:ru|by|kz)\/album\/(\d+)\/track\/(\d+)(?:|\/)$/,

    NORMALIZED_SPOTIFY_ALBUM: /https:\/\/api.spotify.com\/v1\/albums\/([0-9A-Za-z]+)/,
    NORMALIZED_SPOTIFY_TRACK: /https:\/\/api.spotify.com\/v1\/tracks\/([0-9A-Za-z]+)/,

    NORMALIZE_YOUTUBE_LINK: (link: string) => {
        const match = link.match(RegEx.YOUTUBE);
        if (!match || match[1].length !== 11) {
            throw new Error('Got wrong YouTube link!');
        }

        return 'https://www.youtube.com/watch?v=' + match[1];
    },

    NORMALIZE_YANDEX_MUSIC_LINK: (link: string) => {
        const match = link.match(RegEx.YANDEX_MUSIC_ALBUM);
        if (!match) {
            throw new Error('Got wrong Yandex.Music album link!');
        }

        return 'https://music.yandex.ru/album/' + match[1];
    },

    NORMALIZE_YANDEX_MUSIC_TRACK_LINK: (link: string) => {
        const match = link.match(RegEx.YANDEX_MUSIC_TRACK);
        if (!match) {
            throw new Error('Got wrong Yandex.Music track link!');
        }

        return 'https://music.yandex.ru/album/' + match[1] + '/track/' + match[2];
    },

    MASHUP: /^[а-яА-ЯёЁa-zA-Z0-9_$.,=+()*&^%$#@!\-?':| ]{2,48}$/
};
