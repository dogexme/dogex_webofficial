import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable'
import { queryTransferByTxid } from '@/services/nft'
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
    error: Function as PropType<(e: Error) => void>,
  },
  setup(props, { expose }) {
    const data = ref([])
    const total = ref(0)
    const page = ref(1)
    const loading = ref(false)
    const columns = [
      {
        title: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_text: unknown, r: any) => {
          return (
            <>
              {r.id && (
                <el-image
                  v-slots={{ error: () => <div class="el-image__error">#{r.id}</div> }}
                  style="width: 40px; height: 40px; border-radius: 5px"
                  src={`${r.buri}/${r.id}.png`}
                  fit="cover"
                ></el-image>
              )}
            </>
          )
        },
      },
      {
        title: 'Txid',
        dataIndex: 'txid',
        render(text: string) {
          return <>{text && <DogLink is-copy to={`https://chain.so/tx/DOGE/${text}`} label={omitCenterString(text, 24)} value={text}></DogLink>}</>
        },
      },
      {
        title: 'Op',
        dataIndex: 'op',
      },
      {
        title: 'Sender',
        dataIndex: 'sender',
        render(text: string) {
          return <DogLink is-copy label={omitCenterString(text)} value={text}></DogLink>
        },
      },
      {
        title: 'Receiver',
        dataIndex: 'receiver',
        render(text: string) {
          return <DogLink is-copy label={omitCenterString(text)} value={text}></DogLink>
        },
      },
      {
        title: 'Date',
        dataIndex: 'date',
        render(text: string) {
          return text && dateFormat(new Date(text))
        },
      },
      {
        title: 'Content',
        dataIndex: 'content',
      },
    ]

    watch(
      () => props.txid,
      () => {
        getData()
      },
      {
        immediate: true,
      }
    )

    function nextPage(pageNumber: number) {
      page.value = pageNumber
      getData()
    }

    async function getData() {
      loading.value = true
      try {
        const res = await queryTransferByTxid({
          txid: props.txid,
          pageSize: 15,
          page: page.value,
        })
        total.value = res.data.total
        data.value = res.data.data.map((item: { content: string }) => {
          const content = JSON.parse(item.content)
          delete content.txid
          return Object.assign(item, content)
        })
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
