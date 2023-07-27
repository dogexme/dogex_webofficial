import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import store from './store'
import router from './router'
import App from './App.vue'
import i18n from './locales/i18n'
import 'normalize.css'
import './style.css'
import 'element-plus/dist/index.css'

createApp(App).use(i18n).use(store).use(router).use(ElementPlus).mount('#app')
