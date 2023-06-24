import './assets/scss/main.scss'
import './assets/scss/fonts.scss'
import './assets/scss/components.scss'

import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from './stores/user'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const pinia = createPinia()
const app = createApp(App)

router.beforeEach((to) => {
    const auth = useUserStore(pinia)
    return auth.fetchUser().then(e => {
        if (!['login', 'register', 'recover'].includes(to.name)) {
            // if (!auth.isLoggedIn) return { name: 'login' }
        } else {
            if (auth.isLoggedIn) return { name: 'home' }
        }
    })
})

app.use(router)
app.use(Toast, {
    transition: "my-custom-fade",
    maxToasts: 1,
    newestOnTop: true
});

app.mount('#app')