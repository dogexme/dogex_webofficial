import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './router'
import App from './App.vue'
import 'normalize.css'
import './style.css'
import 'element-plus/dist/index.css'

createApp(App).use(router).use(ElementPlus).mount('#app')
