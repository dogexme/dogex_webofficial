import { App } from 'vue'
import { ElLoading, ElEmpty, ElDialog } from 'element-plus'

export default {
  install(app: App) {
    ElDialog.props.lockScroll.default = false

    ElLoading.install(app)
    app.component(ElEmpty.name, ElEmpty)
  },
}
