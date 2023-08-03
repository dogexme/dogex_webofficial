import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
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
      required: true,
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
    const data = ref([])
    const total = ref(0)
    const page = ref(1)
    const loading = computed({
      get() {
        return props.isLoading
      },
      set(isLoading) {
        emit('update:isLoading', isLoading)
      },
    })
    const columns = [
      {
        title: 'Rank',
        render: (_text: unknown, _record: unknown, i: number) => <span class="table-index">{i + 1}</span>,
      },
      {
        title: 'Holder',
        dataIndex: 'nft_owner',
        width: '350px',
        render(text: string) {
          return <DogLink is-copy label={text} value={text}></DogLink>
        },
      },
      {
        title: 'Count',
        dataIndex: 'nft_count',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(text: unknown, record: any) {
          return (
            <>
              {text && (
                <div>
                  {text}
                  <span style="color: #606266">{`(${+(record.ratio * 100).toFixed(2)}%)`}</span>
                  <el-progress style="width: 100%; margin-top: 5px;border:1px solid #000;border-radius:5px" stroke-width={10} percentage={+(record.ratio * 100)} show-text={false} />
                </div>
              )}
            </>
          )
        },
      },
    ]

    function nextPage(pageNumber: number) {
      page.value = pageNumber
      getData()
    }

    async function getData() {
      loading.value = true
      try {
        const res = await queryHoldersByTxid({
          txid: props.txid,
          pageSize: 15,
          page: page.value,
        })
        total.value = res.data.total
        data.value = res.data.data.map((d: { nft_count: number }) => ({ ...d, ratio: d.nft_count / props.collInfo.max! }))
        console.log(data.value)
      } catch (e: unknown) {
        props.error?.(e as Error)
      } finally {
        loading.value = false
      }
    }

    expose({
      reload: getData,
    })

    return () => <DogTable loading={loading.value} dataSource={data.value} columns={columns} currentPage={page.value} total={total.value} onCurrent-change={nextPage} />
  },
})
