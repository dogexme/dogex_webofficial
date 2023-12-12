import DogTable from '@/components/DogTable/DogTable'
import { ElImage } from 'element-plus'
import { queryDrcHolderTickAmount } from '@/services/drc'

export default defineComponent({
  props: {
    address: {
      type: String,
      default: '',
    },
  },
  setup(props, { expose }) {
    const pageSize = 20
    const { loading, dataSource, total, page, query, disabledSlide } = useTable({
      api: getData,
      pageSize,
      first: false,
    })

    watch(
      () => props.address,
      (address) => address && query(1, true)
    )

    const columns = [
      {
        title: 'Logo',
        dataIndex: 'logo',
        render: (_: string, r: any) => {
          return (
            <ElImage
              v-slots={{ error: () => <div class="el-image__error">{r.tick}</div> }}
              style="width: 40px; height: 40px; border-radius: 5px"
              src={`https://raw.githubusercontent.com/dpalwallet/logoasserts/main/asserts/${r.tick == 'dogi' ? 'dogim' : r.tick}.png`}
              fit="cover"
            ></ElImage>
          )
        },
      },
      {
        title: 'Tick',
        dataIndex: 'tick',
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        render(amt: number) {
          return <div class="flex items-center">{numberFormat(amt)}</div>
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
      reload: async () => {
        if (isLoaded) {
          return
        }
        await query(1, true)
        isLoaded = true
      },
    })

    return () => (
      <DogTable
        defaultPageSize={pageSize}
        disabledSlide={disabledSlide.value}
        loading={loading.value}
        dataSource={dataSource.value}
        columns={columns}
        currentPage={page.value}
        total={total.value}
        onCurrent-change={query}
        onRefresh={() => query(page.value)}
      />
    )
  },
})
