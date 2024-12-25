export const RegEx = {
    USERNAME: /(?=^[а-яА-ЯёЁa-zA-Z0-9_ ]{4,32}$)(?!^\\d+$)^.+$/,
    PASSWORD: /[a-zA-Z0-9-_=+()*&^%$#@!]{8,32}/,
    EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    EMAIL_OR_USERNAME:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|(?=^[а-яА-ЯёЁa-zA-Z0-9_ ]{4,32}$)(?!^\\d+$)^.+$/,
    YOUTUBE:
        /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})(|.+)$/,

    YANDEX_MUSIC: /^(?:https?:\/\/)?(?:www\.)?music\.yandex\.(?:ru|by|kz)\/album\/(\d+)(?:|\/)$/,
    YANDEX_MUSIC_TRACK:
        /^(?:https?:\/\/)?(?:www\.)?music\.yandex\.(?:ru|by|kz)\/album\/(\d+)\/track\/\d+(?:|\/)$/,

    NORMALIZE_YOUTUBE_LINK: (link: string) => {
        const match = link.match(RegEx.YOUTUBE);
        if (!match || match[1].length !== 11) {
            throw new Error('Got wrong YouTube link!');
        }

        return 'https://www.youtube.com/watch?v=' + match[1];
    },

    NORMALIZE_YANDEX_MUSIC_LINK: (link: string) => {
        const match = link.match(RegEx.YANDEX_MUSIC);
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
    }
};
