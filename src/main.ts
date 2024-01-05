/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApp } from 'vue'
import store from './store'
import router from './router'
import App from './App.vue'
import Elementui from './element-ui'

//@ts-ignore
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
//@ts-ignore
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'

import './echarts'
import 'normalize.css'
import './style.css'

VMdPreview.use(githubTheme)

createApp(App).use(router).use(store).use(Elementui).use(VMdPreview).mount('#app')
