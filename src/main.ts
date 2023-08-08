import { createApp } from 'vue'
import store from './store'
import router from './router'
import App from './App.vue'
import Elementui from './element-ui'
import 'normalize.css'
import './style.css'

createApp(App).use(router).use(store).use(Elementui).mount('#app')
