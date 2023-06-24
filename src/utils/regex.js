export default {
    EMAIL: "[a-z0-9]+@[a-z]+\\.[a-z]{2,3}",
    USERNAME: "(?=^[а-яА-ЯёЁa-zA-Z0-9_ ]{4,32}$)(?!^\\d+$)^.+$",
    PASSWORD: "[a-zA-Z0-9\\-_=+\\(\\)*&^%$#@!]{8,32}",
    PLAYLIST: "^[а-яА-ЯёЁa-zA-Z0-9_\\$.,=+()*&^%$#@!\\-?':\\| ]{4,48}$",
    DESCRIPTION: "^[а-яА-ЯёЁa-zA-Z0-9_\\$.,=+()*&^%$#@!\\-?':\\| ]{0,512}$",
    MASHUP: "^[а-яА-ЯёЁa-zA-Z0-9_\\$.,=+()*&^%$#@!\\-?':\\| ]{2,48}$",
    TRACK: "^[а-яА-ЯёЁa-zA-Z0-9_\\$.,=+()*&^%$#@!\\-?':\\| ]{1,64}$",

    NORMALIZED_YOUTUBE_VIDEO: "https:\\/\\/www\\.youtube\\.com\\/watch\\?v=([-a-zA-Z0-9_]{11})",
    NORMALIZED_YOUTUBE_PLAYLIST: "https:\\/\\/www\\.youtube\\.com\\/watch\\?v=([-a-zA-Z0-9_]{11})&list=([-a-zA-Z0-9_]{26})",
    NORMALIZED_YANDEX_MUSIC: "https:\\/\\/music\\.yandex\\.ru\\/album\\/(\\d+)",
    NORMALIZED_YANDEX_MUSIC_TRACK: "https:\\/\\/music\\.yandex\\.ru\\/album\\/(\\d+)\\/track\\/(\\d+)"
}