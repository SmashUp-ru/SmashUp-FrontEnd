<template>
  <div class="audio">
    <div>
      <v-icon
        v-model="shuffle"
        class="player-track-info-favorite"
        :class="{ active: shuffle }"
        name="shuffle"
        size="large"
        @click.prevent="togleShuffle"
      />
    </div>
    <div>
      <v-icon
        v-model="arrowLeft"
        class="player-track-info-favorite"
        :class="{ active: arrowLeft }"
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
        :class="{ active: arrowRight }"
        name="arrowRight"
        size="large"
        @click.prevent="togleArrowRight"
      />
    </div>
    <div>
      <v-icon
        v-model="repeat"
        class="player-track-info-favorite"
        :class="{ active: repeat }"
        name="repeat"
        size="large"
        @click.prevent="togleRepeat"
      />
    </div>
    <audio ref="player">
      <source
        :src="src[srcIndex]"
        type="audio/mpeg"
      >
    </audio>
  </div>
</template>
<script setup>
  import VIcon from '../UI/Icon/VIcon.vue';
  import { ref, computed } from 'vue';
  const shuffle = ref(false);
  const arrowLeft = ref(false);
  const arrowRight = ref(false);
  const repeat = ref(false);
  const playerbtn = ref(false);
  const player = ref(null);
  const src = ref([
    'src/assets/music/GarikOk - Toxin Ливси.mp3',
    'src/assets/music/Helltaker - Titanium.mp3',
    'src/assets/music/srakandaev - Vladimirsky Central Rock.mp3',
  ]);

  const duration = player.value;

  const srcIndex = ref(0);

  const playerIcon = computed(() => {
    return {
      name: playerbtn.value ? 'pause' : 'play',
    };
  });

  function togleShuffle() {
    shuffle.value ? (shuffle.value = false) : (shuffle.value = true);
  }

  function togleArrowLeft() {
    arrowLeft.value ? (arrowLeft.value = false) : (arrowLeft.value = true);
    srcIndex.value === 0 || srcIndex.value--;
    player.value.paused && toglePlayer();
    player.value?.load();
    player.value?.play();
    clearArrow();
  }

  function togleArrowRight() {
    arrowRight.value ? (arrowRight.value = false) : (arrowRight.value = true);
    srcIndex.value === src.value.length || srcIndex.value++;
    player.value.paused && toglePlayer();
    player.value?.load();
    player.value?.play();
    clearArrow();
  }

  function togleRepeat() {
    repeat.value ? (repeat.value = false) : (repeat.value = true);
  }

  function toglePlayer() {
    playerbtn.value
      ? (playerbtn.value = false || player.value?.pause())
      : (playerbtn.value = true && player.value?.play());
    console.log(player.value.duration);
  }

  function clearArrow() {
    setTimeout(() => {
      arrowLeft.value = false;
      arrowRight.value = false;
    }, 300);
  }
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
