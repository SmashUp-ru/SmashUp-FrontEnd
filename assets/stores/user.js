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
        async loginUser(login, password, remember = false) {
            const request = await fetch('https://api.smashup.ru/login', {
                method: 'POST',
                mode: "cors",
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    username: login,
                    password: password
                })
            })

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
            const request = await fetch('https://api.smashup.ru/register', {
                method: 'POST',
                mode: "cors",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            })

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