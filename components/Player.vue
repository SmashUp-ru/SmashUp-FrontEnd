<template>
  <div class="player">
    <v-progress-bar :duration="mashup.duration"/>
    <div
      class="player-container"
    >
      <v-track-info :title="mashup.title"/>
      <div>
        <v-audio :src="mashup.src"/>
      </div>
      <div>
        <div class="player-track-info-volume">
          <v-icon
            name="volume"
            size="large"
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
  import { useMashupStore } from "@assets/utils/mashup"
  import VTrackInfo from './player/VTrackInfo.vue';
  import VAudio from './player/VAudio.vue';
  import VIcon from './UI/Icon/VIcon.vue';
  import VProgressBar from './player/VProgressBar.vue';


  const error = ref(null);
  const mashup = useMashupStore();

  mashup.getMashup(1);
</script>
<style lang="scss" scoped>
  .player{
    font-family: 'Inter', sans-serif;
    height: 105px;
    background-color: #1A1A1A;

    &-container {
      height: calc(100% - 8px);
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