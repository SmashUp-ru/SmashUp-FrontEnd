import { defineStore } from 'pinia'

export const useMashupStore = defineStore('mashup', {
  state: () => ({ 
    id: null, 
    title: '',
    bitrate: null,
    imageUrl:'',
    size:'',
    duration:'',
    src:'',
  }),

  // getters: {

  // },

  actions: {
    async getMashup (id) {
      const data = await fetch(`https://api.smashup.ru/mashup/get?id=${id}`)
      const request = await data.json()
      if (!request.status === 'OK') return false
      this.id = request.response[0].id
      this.title = request.response[0].name
      this.imageUrl = request.response[0].imageUrl
      this.bitrate = request.response[0].bitrate
      this.duration = request.response[0].duration
      await this.getMashupContent()
    },

    async getMashupContent () {
      const response = await fetch(`https://api.smashup.ru/uploads/mashup/${this.id}.mp3?bitrate=${this.bitrate}`);
      const blob = await response.blob();
      this.src = URL.createObjectURL(blob);
    }
  }
})