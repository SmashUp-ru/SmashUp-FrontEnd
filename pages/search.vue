<script setup>
const search = {
    best: { author: "" },
    mashups: [{ name: "sada", author: "kkdkfd", imageUrl: "https://i.imgur.com/XcrxO8z.jpeg" }],
    playlists: [{}]
}
</script>

<template>
    <div>
        <div>
            <p>Лучший результат</p>
            <div>
                <img src="" alt="">
                <div></div>
            </div>
        </div>
        <div>
            <p>Мешапы</p>
            <template v-for="(mashup, index) of search.mashups">
                <p>
                    {{ index + 1 }}
                </p>
                <div>
                    <img src="" alt="">
                    <div>
                        <p>{{ mashup.name }}</p>
                        <p>{{ mashup.author }}</p>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <div>
        <p>Плейлисты</p>
    </div>
</template>