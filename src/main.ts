import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import Elementui from './element-ui'
import 'normalize.css'
import './style.css'

createApp(App).use(router).use(Elementui).mount('#app')
