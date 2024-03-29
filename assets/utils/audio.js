import { defineStore } from 'pinia';

export const useAudioStore = defineStore({
  id: 'audio',
  state() {
    return {
      currentTime: 0,
      newTime: null,
    };
  },
  getters: {
    currentTimeFormatted() {
      return this.currentTime*1000;
    },
  },
  actions: {
    setCurrentTime(time) {
      this.currentTime = time;
    },
    setNewTime(time) {
      this.newTime = time;
    },
  },
});