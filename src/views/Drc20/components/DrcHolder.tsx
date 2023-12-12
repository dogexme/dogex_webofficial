import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import { ElProgress } from 'element-plus'
import { queryDrcHolders } from '@/services/drc'

export default defineComponent({
  props: {
    tickInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { expose }) {
    const pageSize = 20
    const { loading, dataSource, total, page, query } = useTable({
      api: getData,
      pageSize,
      first: false,
    })

    const columns = [
      {
        title: 'Address',
        dataIndex: 'address',
        width: '350px',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(text: string) {
          return <DogLink route to={`/address/${text}`} is-copy label={text} value={text}></DogLink>
        },
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(text: number, record: any) {
          return (
            <>
              {text && (
                <div>
                  {numberFormat(text)}
                  <span style="color: #606266">{`(${+(record.ratio * 100).toFixed(2)}%)`}</span>
                  <ElProgress style="width: 100%; margin-top: 5px;" stroke-width={10} percentage={+(record.ratio * 100)} show-text={false} />
                </div>
              )}
            </>
          )
        },
      },
    ]

    async function getData(page: number, pageSize: number) {
      const res = await queryDrcHolders({
        tick: props.tickInfo.tick,
        pageSize,
        page,
      })

      return {
        total: res.data.data.total,
        data: res.data.data.holders.map((d: { balance: number }) => ({ ...d, ratio: d.balance / props.tickInfo.mintVal })),
      }
    }

    let isLoaded = false

    expose({
      reload: async () => {
        if (isLoaded) {
          return
        }
        await query(1)
        isLoaded = true
      },
    })

    return () => (
      <DogTable
        defaultPageSize={pageSize}
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
