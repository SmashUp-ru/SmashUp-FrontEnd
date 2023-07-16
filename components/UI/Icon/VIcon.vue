<template>
  <svg
    class="v-icon"
    :viewBox="`${view}`"
    :class="{
      ['v-icon--size-' + size]: size,
      ['v-icon--theme-' + theme]: theme
    }"
  >
    <component :is="iconComponent"></component>
  </svg>
</template>

<script>
import * as icons from './icons';

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    view: {
      type: String,
      default: '0 0 32 32'
    },
    size: {
      type: String,
      default: 'medium'
    },
    theme: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    iconComponent() {
      const nameUppercase = this.name.charAt(0).toUpperCase() + this.name.slice(1);
      const componentName = 'VIcon' + nameUppercase;

      return icons[componentName];
    }
  },
  components: icons
};
</script>

<style scoped>
.v-icon {
  display: inline-flex;
  flex-shrink: 0;
  transition: var(--transition-base);
}
.v-icon--size-large {
  width: 32px;
  height: 32px;
}
.v-icon--size-medium {
  width: 24px;
  height: 24px;
}
.v-icon--theme-primary {
  fill: #EBEBEB;
}
.v-icon--theme-secondary {
  fill: #EBEBEB;
}
</style>
