import api from "./api"
import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
export const useUserStore = defineStore('user', {
    state: () => ({
        id: 0,
        username: "",
        imageUrl: "",
        permissions: 0,
        music: {
            currentSong: "",
            songList: []
        },
        isLoggedIn: false,
    }),
    actions: {
        async fetchUser() {
            const { get } = await useCookies(["auth"])
            const token = await get("token")

            if (!token) return false
            const request = await fetch('https://api.smashup.ru/user/get?' + new URLSearchParams({ token }), { method: "GET" })


            if (!request.ok) return false
            const body = await request.json()

            this.id = body.response.id
            this.username = body.response.username
            this.imageUrl = body.response.imageUrl
            this.permissions = body.response.permissions
            this.isLoggedIn = true
            return true
        },
        async loginUser(username, password, remember = false) {
            const request = await api('/login', { method: "POST", body: { username, password } })

            if (!request.ok) return false
            const body = await request.json()

            this.id = body.response.id
            this.username = body.response.username
            this.imageUrl = body.response.imageUrl
            this.permissions = body.response.permissions
            this.isLoggedIn = true

            const expires = new Date(Date.now() + (remember? 60 * 60 * 24 * 30 : 60 * 60 ) * 1000)
            
            const { set } = await useCookies(["auth"])
            await set("token", body.response.token, { expires })
            return true
        },
        async registerUser(username, email, password) {
            const request = await api('/register', { method: "POST", body: { username, email, password } })

            if (!request.ok) return false
            const body = await request.json()

            this.id = body.response.id
            this.username = body.response.username
            this.imageUrl = body.response.imageUrl
            this.permissions = body.response.permissions
            this.isLoggedIn = true

            const expires = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000)
            
            const { set } = await useCookies(["auth"])
            await set("token", body.response.token, { expires })
            return true
        },
        // async recoverUser(email) {

        // }
      },
})