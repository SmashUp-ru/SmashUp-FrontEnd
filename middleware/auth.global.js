import { useUserStore } from "@assets/utils/user"

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useUserStore()
    const isLoggedIn = user.fetchUser().then(() => user.isLoggedIn)
    const isAuthPath = ['login', 'register', 'recover', '404'].includes(to.name)

    if (isAuthPath && isLoggedIn) return navigateTo("/")
    if (!isAuthPath && !isLoggedIn) return navigateTo("/login")
})