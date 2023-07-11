<template>
  <div class="player">
    <v-progress-bar/>
    <div
      class="player-container"
    >
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
  import VProgressBar from './VProgressBar.vue';
    
  const trackInfo = ref({
    id:1,
    autor:'Неизвестен',
    autorLink:'/playlist',
    link:'/',
    title:'Без названия',
    img:'../Картинка.png',

  });

  function muteVolume () {
    favoriteStatus.value ? favoriteStatus.value = false : favoriteStatus.value = true;
  }
</script>
<style lang="scss" scoped>
  .player{
    font-family: 'Inter', sans-serif;
    height: 105px;
    background-color: var(--color-background);

    &-container {
      height: calc(100% - 6px);
      margin: 0 40px;

      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-track-info {
      &-volume {
        display: flex;
        align-items: center;
        gap: var(--gutter-12);
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