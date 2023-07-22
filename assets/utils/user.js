import api from "./api"
import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'

export const useUserStore = defineStore('user', {
    state: () => ({
        id: 0,
        username: "",
        imageUrl: "",
        permissions: 0,
        isLoggedIn: false,
    }),
    actions: {
        async fetchUser() {
            const { get } = await useCookies(["auth"])
            const token = await get("token")

            if (this.isLoggedIn) return true
            if (!token) return false

            const data = await api('/user/get?' + new URLSearchParams({ token }), { method: "GET" })
            const request = await data.json()

            if (!request.status === 'OK') return false

            this.id = request.response.id
            this.username = request.response.username
            this.imageUrl = request.response.imageUrl
            this.permissions = request.response.permissions
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
            return true
        },
        // async recoverUser(email) {

        // }
      },
})

export const usePlaylistStore = defineStore('playlists', {
    state: () => ({
        likes: [],
        created: [],
        recomendation: []
    }),
    actions: {
        async fetchPlaylists() {
            const user = useUserStore()
            await user.fetchUser()

            const { get } = await useCookies(["auth"])
            const token = await get("token")

            if (!token || !user.id) return false
            const created = await api('/playlist/get_by_user?id=' + new URLSearchParams({ id: user.id }), { method: "GET" })
            const likes = await api('/playlist/get_all_likes', { method: "GET", headers: { Authorization: `Bearer ${token}` } })
            const recomendation = await api('/recommendations/v1', { method: "GET", headers: { Authorization: `Bearer ${token}` } })

            this.created = await (created.json()).response
            this.likes = await (likes.json()).response
            this.recomendation = await (recomendation.json()).response

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