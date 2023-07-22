<template>
  <div class="progress-bar" ref="progressBar" @click="handleClick">
    <div class="progress-bar-track">
      <div
        class="progress-bar-fill"
        :style="{ width: fillWidth }"
      />
    </div>
  </div>
</template>
<script setup>
  import { computed, defineProps } from 'vue';

  import { useAudioStore } from '@assets/utils/audio';

  const audioStore = useAudioStore();

  const progressBar = ref(null);

  // Доступ к текущему значению времени воспроизведения
  const currentTimeFormatted = computed(() => audioStore.currentTimeFormatted);

  const props = defineProps({
    duration: {
      type: Number,
      default: null
    }
  })

  const fillWidth = computed(() => `${(currentTimeFormatted.value / props.duration) * 100}%`);

  function handleClick(event) {
    const progressBarWidth = progressBar.value.clientWidth;
    const clickPosition = event.clientX - progressBar.value.getBoundingClientRect().left;
    const newTime = (clickPosition / progressBarWidth) * props.duration / 1000;

    audioStore.setNewTime(newTime);
  }

</script>

<style lang="scss" scoped>
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #15121E;
  border-radius: 4px;
  overflow: hidden;

  &-track {
    height: 100%;
    background-color: #15121E;
  }

  &-fill {
    height: 100%;
    background-color: #EBEBEB;
    transition: width 0.3s ease-in-out;
  }
}
</style>