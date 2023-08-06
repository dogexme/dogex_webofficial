import DogPagination from './DogPagination.vue'
import s from './index.module.scss'

export default defineComponent({
  props: {
    loading: Boolean,
    dataSource: {
      type: Array,
      default: () => [],
    },
    defaultPageSize: {
      type: Number,
      default: 15,
    },
    total: {
      type: Number,
      default: 15,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    totalText: String,
  },
  setup(props, { slots, emit }) {
    const currentPage = ref(props.currentPage)
    const jumpPage = ref('')
    let prevPage = -1

    const pages = computed(() => Math.ceil(props.total / props.defaultPageSize))

    function changePage(page: number) {
      if (page == prevPage) return
      prevPage = page
      emit('current-change', page)
    }

    watch(
      () => props.loading,
      (loading) => {
        if (!loading) {
          resetPositionTop()
        }
      }
    )

    function resetPositionTop() {
      const resetPosition: ScrollToOptions = {
        top: 0,
        left: 0,
        behavior: 'smooth',
      }
      window.scrollTo(resetPosition)
    }

    return () => (
      <div class={s['dog-list']} v-loading={props.loading}>
        {!!props.dataSource.length && pages.value > 1 && (
          <DogPagination
            style="margin-bottom: 20px"
            totalText={props.totalText}
            v-model:currentPage={currentPage.value}
            v-model:jumpPage={jumpPage.value}
            pages={pages.value}
            total={props.total}
            onCurrent-change={changePage}
          />
        )}

        {slots.default?.(props.dataSource)}
        {!props.dataSource.length && <el-empty></el-empty>}
        {!!props.dataSource.length && pages.value > 1 && (
          <DogPagination
            style="margin-top: 20px"
            totalText=" "
            v-model:currentPage={currentPage.value}
            v-model:jumpPage={jumpPage.value}
            pages={pages.value}
            total={props.total}
            onCurrent-change={changePage}
          />
        )}
      </div>
    )
  },
})
