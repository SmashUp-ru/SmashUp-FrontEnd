<template>
  <div class="player">
    <div class="player-bar">
      <div class="player-bar-progress"/>
    </div>
    <div class="player-container">
      <v-track-info :info="trackInfo"/>
      <div>
        <v-audio/>
      </div>
      <div>
        <div class="player-track-info-volume">
          <v-icon
            name="volume"
            size="large"
            @click="muteVolume"
          />
          <div class="player-track-info-volume-bar">
            <input
              id="bar"
              type="range"
              min="0"
              max="50"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import VTrackInfo from './VTrackInfo.vue';
  import VAudio from './VAudio.vue';
  import VIcon from '../UI/Icon/VIcon.vue';
    
  const trackInfo = ref({
    id:1,
    autor:'Неизвестен',
    title:'Без названия',
    img:'../Картинка.png'
  });

  function togleLike () {
    favoriteStatus.value ? favoriteStatus.value = false : favoriteStatus.value = true;
  }

  function muteVolume () {
    favoriteStatus.value ? favoriteStatus.value = false : favoriteStatus.value = true;
  }
</script>
<style lang="scss" scoped>
  .player{
    font-family: 'Inter', sans-serif;
    height: 105px;
    background-color: var(--color-background);

    &-bar {
      width: 100%;
      height: 6px;
      background-color: var(--color-surface);

      &-progress {
        background-color: var(--color-onsurface);
        height: 100%;
        width: 10%;
        border-radius: var(--radius-4);
      }
    }
    

    &-container {
      height: calc(100% - 6px);

      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-track-info {
      margin-left: var(--gutter-40);
      display: flex;
      gap: 24px;

      &-container {
        display: flex;
        gap: 5px;
        flex-direction: column;
        justify-content: center;
        font-size: 14px;
        line-height: 17px;
      }

      &-favorite{ 
        margin-top: auto;
        margin-bottom: auto;
        &:hover {
          cursor: pointer;
        }
      }
      
      &-img {
        width: 64px;
        height: 64px;
        object-fit: cover;
      }

      &-link {
        color: var(--color-onsurface);
        text-decoration: none;
      }

      &-title {
        font-weight: 600;
      }

      &-volume {
        display: flex;
        align-items: center;
        gap: var(--gutter-12);
        margin-right: var(--gutter-32);
        &-bar {
          
        }
      }
    }
    #bar{ 
      &::-webkit-slider-runnable-track {
        height: 4px;
      }
      &::-webkit-slider-thumb {
        visibility: hidden;
      }
    }
  }
</style>