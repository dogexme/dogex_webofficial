import { createApp } from 'vue'
import store from './store'
import router from './router'
import App from './App.vue'
import i18n from './locales/i18n'
import 'normalize.css'
import './style.css'

createApp(App).use(i18n).use(store).use(router).mount('#app')
