<template>
  <div class="audio">
    <div>
      <v-icon
        v-model="shuffle"
        class="player-track-info-favorite"
        :class="{'active':shuffle}"
        name="shuffle"
        size="large"
        @click.prevent="togleShuffle"
      />
    </div>
    <div>
      <v-icon
        v-model="arrowLeft"
        class="player-track-info-favorite"
        :class="{'active':arrowLeft}"
        name="arrowLeft"
        size="large"
        @click.prevent="togleArrowLeft"
      />
    </div>
    <div>
      <v-icon
        v-model="playerbtn"
        class="player-track-info-favorite"
        :name="playerIcon.name"
        size="large"
        @click.prevent="toglePlayer"
      />
    </div>
    <div>
      <v-icon
        v-model="arrowRight"
        class="player-track-info-favorite"
        :class="{'active':arrowRight}"
        name="arrowRight"
        size="large"
        @click.prevent="togleArrowRight"
      />
    </div>
    <div>
      <v-icon
        v-model="repeat"
        class="player-track-info-favorite"
        :class="{'active':repeat}"
        name="repeat"
        size="large"
        @click.prevent="togleRepeat"
      />
    </div>
    <audio ref="player">
      <source
        src="../../assets/music/GarikOk - Toxin Ливси.mp3"
        type="audio/mpeg"
      >
    </audio>
  </div>
</template>
<script>
  import VIcon from '../UI/Icon/VIcon.vue';
  import { ref, computed } from 'vue';
  export default {
    components: {
      VIcon
    },
    setup() {
      const shuffle = ref(false);
      const arrowLeft = ref(false);
      const arrowRight = ref(false);
      const repeat = ref(false);
      const playerbtn = ref(false);
      const player = ref(null);

      const playerIcon = computed (()=> {
        return {
          name: playerbtn.value ? "pause" : "play"
        };
      });

      function togleShuffle () {
        shuffle.value ? shuffle.value = false : shuffle.value = true;
      }
      function togleArrowLeft () {
        arrowLeft.value ? arrowLeft.value = false : arrowLeft.value = true;
      }
      function togleArrowRight () {
        arrowRight.value ? arrowRight.value = false : arrowRight.value = true;
      }
      function togleRepeat () {
        repeat.value ? repeat.value = false : repeat.value = true;
      }
      function toglePlayer () {
        playerbtn.value ? playerbtn.value = false || player.value?.pause() : playerbtn.value = true && player.value?.play();

      }
      return {
        shuffle,
        arrowLeft,
        arrowRight,
        repeat,
        player,
        playerbtn,
        playerIcon,
        togleArrowLeft,
        togleArrowRight,
        togleRepeat,
        togleShuffle,
        toglePlayer
      };
    }
  };
</script>
<style lang="scss" scoped>
.audio {
  display: flex;
  gap: var(--gutter-24);
}
.active {
  fill: var(--color-primary);
}
</style>