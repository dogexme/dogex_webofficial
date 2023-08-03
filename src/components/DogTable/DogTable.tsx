import DogPagination from '../DogPagination.vue'
import s from './DogTable.module.scss'

interface ColumnProps {
  dataIndex?: string
  align?: 'left' | 'right' | 'center'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (text: any, record: any, index: number) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title?: any
  width?: string
}

export default defineComponent({
  props: {
    columns: {
      type: Array as PropType<Array<ColumnProps>>,
      required: true,
    },
    dataSource: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    rowkey: {
      type: String,
      default: 'id',
    },
    layout: {
      type: String,
      default: 'prev, pager, next',
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
    loading: {
      type: Boolean,
      default: false,
    },
    totalText: String,
  },
  emits: ['current-change'],
  setup(props, { emit }) {
    const containerRef = ref<HTMLElement>()
    const currentPage = ref(props.currentPage)
    const jumpPage = ref('')

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
      containerRef.value?.scrollTo(resetPosition)
      window.scrollTo(resetPosition)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function renderTbodyTd(record: any, i: number) {
      return props.columns
        .map((c) => c.dataIndex)
        .map((dataIndex, columnsIndex) => {
          const text = record[dataIndex!]
          const render = props.columns[columnsIndex].render
          return (
            <td class={s['dog-table-td']} key={dataIndex}>
              {render ? render(text, record, i) : text}
            </td>
          )
        })
    }

    let prevPage = -1

    function changePage(page: number) {
      if (page == prevPage) return
      prevPage = page
      emit('current-change', page)
    }

    return () => {
      return (
        <div class={s['table-wrapper']} v-loading={props.loading}>
          <DogPagination
            style="margin-bottom: 20px"
            totalText={props.totalText}
            v-model:currentPage={currentPage.value}
            v-model:jumpPage={jumpPage.value}
            defaultPageSize={props.defaultPageSize}
            total={props.total}
            onCurrent-change={changePage}
          />
          <div class={s['table-container']} ref={containerRef}>
            <table class={s['dog-table']}>
              <thead class={s['dog-table-th']}>
                <tr class={s['dog-table-tr']}>
                  {props.columns.map((c) => {
                    return (
                      <td class={s['dog-table-td']} style={[{ textAlign: c.align || 'left' }, c.width! && { width: c.width }]} key={c.dataIndex}>
                        {c.title}
                      </td>
                    )
                  })}
                </tr>
              </thead>
              <tbody class={s['dog-table-tb']}>
                {props.dataSource.map((record, i) => {
                  return (
                    <tr class={s['dog-table-tr']} key={record[props.rowkey]}>
                      {renderTbodyTd(record, i)}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <DogPagination
            style="margin-top: 20px"
            v-model:currentPage={currentPage.value}
            v-model:jumpPage={jumpPage.value}
            defaultPageSize={props.defaultPageSize}
            total={props.total}
            onCurrent-change={changePage}
          />
        </div>
      )
    }
  },
})
