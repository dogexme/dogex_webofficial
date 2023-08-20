import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import { ElProgress } from 'element-plus'
import { queryHoldersByTxid } from '@/services/nft'
import { CollInfo } from '@/types'

export default defineComponent({
  props: {
    txid: {
      type: String,
      required: true,
    },
    collInfo: {
      type: Object as PropType<Partial<CollInfo>>,
      default: () => ({})
    },
    tabVal: {
      type: String,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    error: Function as PropType<(e: Error) => void>,
  },
  emits: ['update:isLoading'],
  setup(props, { emit, expose }) {
    const { loading, dataSource, total, page, query } = useTable({
      api: getData,
      pageSize: 15,
      first: false
    })

    const columns = [
      {
        title: 'Rank',
        render: (_text: unknown, _record: unknown, i: number) => <span class="table-index">{(page.value - 1) * 15 + i + 1}</span>,
        width: '100px',
      },
      {
        title: 'Holder',
        dataIndex: 'nft_owner',
        width: '350px',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(text: string) {
          return <DogLink route to={`/address/${text}`} is-copy label={text} value={text}></DogLink>
        },
      },
      {
        title: 'Count',
        dataIndex: 'nft_count',
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

    watch(loading, (isLoading) => {
      emit('update:isLoading', isLoading)
    })

    async function getData(page: number, pageSize: number) {
      try {
        const res = await queryHoldersByTxid({
          txid: props.txid,
          pageSize,
          page,
        })
        return {
          total: res.data.total,
          data: res.data.data.map((d: { nft_count: number }) => ({ ...d, ratio: d.nft_count / props.collInfo.max! }))
        }
      } catch (e: unknown) {
        props.error?.(e as Error)
        throw e
      }
    }

    const isLoaded = ref(false)

    expose({
      reload: () => {
        if (page.value == 1 && !isLoaded.value) {
          query(1)
          isLoaded.value = true
        } else {
          page.value = 1
        }
      },
      setLoad(isLoad: boolean) {
        isLoaded.value = isLoad
      }
    })

    return () => <DogTable loading={loading.value} dataSource={dataSource.value} columns={columns} currentPage={page.value} total={total.value} onCurrent-change={query} onRefresh={() => query(page.value)}/>
  },
})
