<script setup>
const categories = [
  { name: "Подборки", playlists: [
    { image: "https://i.imgur.com/XcrxO8z.jpeg", name: "Мешап радио", user: "SmashUp", id: "92" },
    { image: "https://i.imgur.com/XcrxO8z.jpeg", name: "Мешап радио", user: "SmashUp", id: "92" },
    { image: "https://i.imgur.com/XcrxO8z.jpeg", name: "Мешап радио", user: "SmashUp", id: "92" },
    { image: "https://i.imgur.com/XcrxO8z.jpeg", name: "Мешап радио", user: "SmashUp", id: "92" },
    { image: "https://i.imgur.com/XcrxO8z.jpeg", name: "Мешап радио", user: "SmashUp", id: "92" },
    { image: "https://i.imgur.com/XcrxO8z.jpeg", name: "Мешап радио", user: "SmashUp", id: "92" }
  ] },
  { name: "Недавно прослушано", playlists: [
    { image: "https://i.imgur.com/XcrxO8z.jpeg", name: "Мешап радио", user: "SmashUp", id: "92" }
  ] }
]

</script>

<template>
  <div class="playlistsWraper">
    <template v-for="category of categories" :key="category">
      <div class="playlistsConatiner">
        <p class="playlists_name">{{ category.name }}</p>
        <div class="playlists">
          <template v-for="playlist of category.playlists" :key="playlist">
            <a :href="`/playlist/${playlist.id}`" class="playlist">
              <img class="playlist_image" :src="playlist.image" alt="">
              <p class="playlist_name">{{ playlist.name }}</p>
              <p class="playlist_user">{{ playlist.user }}</p>
            </a>
          </template>
        </div>  
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.playlists {
    width: 100%;
    display: flex;
    overflow-x: scroll;
    gap: 30px;
    &Conatiner {
      width: 100%;
    }

    &_name {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &Wraper {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 48px;
    }
  }

  .playlist {
    display: flex;
    padding: 25px;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 32px;
    background-color: #0A0A0A;
    gap: 15px;

    &:first-child {
      margin-left: 0;
    }

    &_text {
      display: flex;
      width: 188px;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    &_image {
      width: 188px;
      height: 188px;
      border-radius: 24px;
    }

    &_name {
      color: #EBEBEB;
      font-weight: 600;
    }

    &_user {
      color: #BCBCBC;
      font-size: 16px;
      font-weight: 400;
    }
  }
</style>