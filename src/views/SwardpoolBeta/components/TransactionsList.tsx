import DogTable, { ColumnProps } from '@/components/DogTable/DogTable'
import DogLink from '@/components/DogLink.vue'
import DogSearch from '@/components/DogSearch.vue'
import { queryTransAddress } from '@/services/sword'
import { PropType } from 'vue'
import { numberFormat } from '@/utils'
import { SwordPool } from '@/services/types'

export default defineComponent({
  props: {
    currentPool: {
      type: Object as PropType<SwordPool>,
    },
  },
  setup(props, { expose }) {
    const { loading, dataSource, total, page, query, disabledSlide } = useTable({
      first: false,
      api: getData,
      pageSize: 20,
    })

    const params = reactive({
      address: '',
    })

    const originColumns: ColumnProps[] = [
      {
        title: 'Block No',
        dataIndex: 'blockno',
      },
      {
        title: 'Sender',
        dataIndex: 'sender',
        render(text: string) {
          return <DogLink is-copy label={omitCenterString(text, 255)} value={text}></DogLink>
        },
      },
      {
        title: 'Receiver',
        dataIndex: 'receiver',
        render(text: string) {
          return <DogLink is-copy label={omitCenterString(text, 255)} value={text}></DogLink>
        },
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        render(balanceA: number) {
          return `${numberFormat(balanceA)} ${props.currentPool?.tokenB}`
        },
      },
    ]

    const columns = ref(originColumns)

    async function getData(page: number, pageSize: number) {
      const res = await queryTransAddress({ pageSize, page, address: params.address || undefined })
      const { status, data } = res.data
      return status == 'success'
        ? {
            total: data.total,
            data: data.list,
          }
        : {
            total: 0,
            data: [],
          }
    }

    let isLoaded = false

    expose({
      load: () => {
        if (isLoaded) {
          return
        }
        isLoaded = true
        query(1)
      },
    })

    return () => (
      <div class="relative mt-12">
        <div class="flex absolute w-full box-border pr-10">
          <DogSearch
            class="flex-1"
            style="max-width: 300px"
            v-model={params.address}
            loading={loading.value}
            onSearch={() => {
              query(1, true)
            }}
            onClear={() => {
              params.address = ''
              query(1, true)
            }}
          ></DogSearch>
        </div>
        <DogTable
          defaultPageSize={20}
          rowkey="id"
          loading={loading.value}
          dataSource={dataSource.value}
          columns={columns.value}
          total={total.value}
          currentPage={page.value}
          onCurrent-change={query}
          onRefresh={() => query(page.value)}
          disabledSlide={disabledSlide.value}
        />
      </div>
    )
  },
})
