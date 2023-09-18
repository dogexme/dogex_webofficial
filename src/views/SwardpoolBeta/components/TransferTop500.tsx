import DogTable, { ColumnProps } from '@/components/DogTable/DogTable'
import DogLink from '@/components/DogLink.vue'
import { queryTop500 } from '@/services/sword'
import { PropType } from 'vue'
import { numberFormat } from '@/utils'
import { ElProgress } from 'element-plus'
import { SwordPool } from '@/services/types'

export default defineComponent({
  props: {
    currentPool: {
      type: Object as PropType<SwordPool>,
    },
  },
  setup(props) {
    const { loading, dataSource, total, page, query } = useTable({
      api: getData,
      pageSize: 500,
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

    watch(
      () => props.currentPool?.pooladdress,
      () => {
        query(1)
      }
    )

    async function getData() {
      const res = await queryTop500()
      const { status, data } = res.data
      const totalBalance = data.top500.reduce((p: number, q: { balance: number }) => p + q.balance, 0)
      data.top500 = data.top500.map((t: { balance: number; rate: number }) => {
        t.rate = t.balance / totalBalance
        return t
      })
      return status == 'success'
        ? {
            total: 500,
            data: data.top500,
          }
        : {
            total: 0,
            data: [],
          }
    }

    return () => (
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
    )
  },
})
