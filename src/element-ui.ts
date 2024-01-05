import { App } from 'vue'
import { ElLoading, ElEmpty, ElDialog } from 'element-plus'

export default {
  install(app: App) {
    ElLoading.install(app)
    app.component(ElEmpty.name, ElEmpty)
  },
}
