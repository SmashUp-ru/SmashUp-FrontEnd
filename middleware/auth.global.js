import { useUserStore } from "@assets/utils/user"

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await useUserStore()
    await user.fetchUser()
    
    if (!user.id) return
    if (!['login', 'register', 'recover', '404'].includes(to.name)) {
        if (!user.isLoggedIn) return navigateTo('/login')
    } else {
        if (user.isLoggedIn) return navigateTo('/')
    }
})