<script setup>
  import '@assets/scss/main.scss'
  import '@assets/scss/fonts.scss'
  import '@assets/scss/components.scss'

  console.log(process.env)
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>
