import DogTable, { ColumnProps } from '@/components/DogTable/DogTable'
import DogLink from '@/components/DogLink.vue'
import { getBalanceByPoolAddress, queryTop500 } from '@/services/sword'
import { PropType } from 'vue'
import { numberFormat } from '@/utils'
import { ElProgress } from 'element-plus'
import { SwordPool } from '@/services/types'
import DogSearch from '@/components/DogSearch.vue'

function computedHoldRadio(balance: number) {
  return balance / (21 * 100000000)
}

export default defineComponent({
  props: {
    currentPool: {
      type: Object as PropType<SwordPool>,
    },
  },
  setup(props, { expose }) {
    const { loading, dataSource, total, page, query, refresh } = useTable({
      first: false,
      api: getData,
      pageSize: 500,
    })

    const params = reactive({
      address: '',
    })
    const originColumns: ColumnProps[] = [
      {
        title: 'Top',
        width: '100px',
        render(_text: string, _record, i: number) {
          return i + 1
        },
      },
      {
        title: 'Address',
        dataIndex: 'address',
        width: '350px',
        render(text: string) {
          return <DogLink is-copy label={text} value={text}></DogLink>
        },
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        render(balance: number, record: any) {
          return (
            <div>
              {`${numberFormat(balance)} ${props.currentPool?.tokenB}`}
              <span style="color: #606266;margin-left: 6px">{`(${+(record.rate * 100).toFixed(2)}%)`}</span>
              <ElProgress style="width: 100%; margin-top: 5px;" stroke-width={10} percentage={+(record.rate * 100)} show-text={false} />
            </div>
          )
        },
      },
    ]

    const columns = ref(originColumns)

    const controller = ref()
    async function getBanlance() {
      controller.value?.abort()
      controller.value = new AbortController()
      loading.value = true
      try {
        const res = await getBalanceByPoolAddress(params.address, {
          signal: controller.value.signal,
        })
        const data = res.data
        if (data.length && data[0]?.balance) {
          const { address, balance } = data[0]
          dataSource.value = [
            {
              address,
              balance,
              rate: computedHoldRadio(balance),
            },
          ]
        } else {
          dataSource.value = []
        }
      } finally {
        loading.value = false
      }
    }

    async function getData() {
      const res = await queryTop500()
      const { status, data } = res.data
      data.top500 = data.top500.map((t: { balance: number; rate: number }) => {
        t.rate = computedHoldRadio(t.balance)
        return t
      })
      return status == 'success'
        ? {
            status,
            total: 500,
            data: data.top500,
          }
        : {
            total: 0,
            data: [],
          }
    }

    expose({
      load: refresh,
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
              getBanlance()
            }}
            onClear={() => {
              params.address = ''
              controller.value?.abort()
              query(1, true)
            }}
          ></DogSearch>
        </div>
        <DogTable
          defaultPageSize={500}
          rowkey="id"
          loading={loading.value}
          dataSource={dataSource.value}
          columns={columns.value}
          total={total.value}
          currentPage={page.value}
          onCurrent-change={query}
          onRefresh={() => query(page.value)}
        />
      </div>
    )
  },
})
