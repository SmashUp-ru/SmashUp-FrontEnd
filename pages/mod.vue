<script setup>
const songs = [{
  url: "https://music.yandex.ru/song/394349",
  image: "https://i.imgur.com/XcrxO8z.jpeg",
  name: "Я устал",
  author: "MeowOnidMuuuow",
  explixit: true,
  sources: [{ name: "Tous Les Mêmes", author: "Stromae" }]
}]
</script>

<template>
  <main>
    <p class="mainTitle">Модерация</p>
    <fieldset>
      <div class="switch-toggle switch-candy">
        <input id="pending" name="search" type="radio" checked>
        <label for="pending" onclick="">Ожидает проверки</label>

        <input id="accepted" name="search" type="radio">
        <label for="accepted" onclick="">Принятые</label>

        <input id="rejected" name="search" type="radio">
        <label for="rejected" onclick="">Отклоненные</label>

        <a></a>
      </div>
    </fieldset>

    <template v-for="song of songs" :key="song">
      <div class="songContainer">
        <div class="songInfo">
          <div class="songText">
            <img class="songMiniImage" :src="song.image" alt="">
            <div>
              <div style="display: flex;">
                <p class="songName">{{ song.name }}</p>
                <img v-if="song.explixit" src="icons/home/explixit.svg">
              </div>
              <p class="songAuthor">{{ song.author }}</p>
            </div>
          </div>

          <div class="songButtons">
            <button class="songPlay"></button>
            <button class="button button_fill button_fill_default1">Принять</button>
            <button class="button button_fill button_fill_default2">Отклонить</button>

            <img src="" alt=""> <!-- Кнопка ракрытия -->
          </div>
        </div>

        <div class="songMain">
          <img src="" alt="">

          <div class="songEdit">
            <div>
              <label for=""></label>
              <input type="text">
            </div>

            <div>
              <label for=""></label>
              <input type="text">
            </div>
          </div>

          <div class="songSources">
            <template v-for="(source, index) of song.sources" :key="source">
              <div>
                <p>{{ index }}</p>
                <img src="" alt="">
                <div>
                  <p>{{ source.name }}</p>
                  <p>{{ source.author }}</p>
                </div>
              </div>
            </template>
          </div>

          <div class="songGenres"></div>

          <div class="songExtras">
            <div class="songExplixit">
              <label for="">Дополнительно</label>
              <input type="text">
              <label for="">Explixit (Мат, Банворды)</label>
            </div>

            <div class="songLink">
              <label for="">Ссылка на пост ВК (Основа, Альт)</label>
              <input type="text">
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped lang="scss">
  .mainContainer {
    display: flex;
  }

  main {
    width: 90%;
  }

  .mainTitle {
    font-size: 32px;
    font-weight: 600;
  }

  fieldset {
    border: none;
    width: fit-content;
    border-radius: 8px;
    background-color: #121212;
  }
  
  .songContainer {
  }

  .songInfo {
    display: flex;
    height: 72px;
    padding: 12px 24px 12px 16px;
    align-items: center;
    gap: 16px;
    align-self: stretch;
    justify-content: space-between;
  }

  .songButtons, .songText {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
  }

  .button {
    width: 140px;
    height: 36px;
    border-radius: 10px;
  }

  .songMiniImage {
    width: 48px;
    height: 48px;
    border-radius: 8px;
  }

  .songName {
    font-size: 15px;
    font-weight: 600;
  }

  .songAuthor {
    font-size: 12px;
    font-weight: 400;
  }
</style>