import { useUserStore } from "@assets/utils/user"

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useUserStore()
    user.fetchUser().then(() => {
        if (!['login', 'register', 'recover', '404'].includes(to.name)) {
            if (!user.isLoggedIn) return navigateTo('/login')
        } else {
            if (user.isLoggedIn) return navigateTo('/')
        }
    })
})