import DogTable from '@/components/DogTable/DogTable'
import { queryDrcHolderTickAmount } from '@/services/drc'

export default defineComponent({
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  setup(props, { expose }) {
    const { dataSource, page, total, loading, query } = useTable({
      api: getData,
      first: false,
    })

    const columns = [
      {
        title: 'Tick',
        dataIndex: 'tick',
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        render(amt: number) {
          return (
            <div class="flex items-center">
              {numberFormat(amt)}
              {/* <img class="ml-2" style={{ borderRadius: '50%', width: '24px' }} src={icon.dogim} alt="" /> */}
            </div>
          )
        },
      },
    ]

    async function getData() {
      const res = await queryDrcHolderTickAmount({
        address: props.address,
      })

      const data = res.data.data.ticks

      return {
        total: 1,
        data,
      }
    }

    let isLoaded = false

    expose({
      load: async () => {
        if (isLoaded) return
        await query(1)
        isLoaded = true
      },
    })

    return () => (
      <DogTable loading={loading.value} dataSource={dataSource.value} columns={columns} currentPage={page.value} total={total.value} onCurrent-change={query} onRefresh={() => query(page.value)} />
    )
  },
})
