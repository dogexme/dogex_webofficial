import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import { ElImage } from 'element-plus'
import { queryTransferByTxid } from '@/services/nft'
import { CollInfo } from '@/types'
import { setCollectionLogo } from '@/utils'

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

    const originColumns = [
      {
        title: 'Item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_text: unknown, r: any) => {
          return (
            <>
              {r.id && (
                <ElImage
                  v-slots={{ error: () => <div class="el-image__error">#{r.id}</div> }}
                  style="width: 40px; height: 40px; border-radius: 5px"
                  src={`${r.baseuri}/${r.contentTxid}/${r.id}.png`}
                  fit="cover"
                ></ElImage>
              )}
            </>
          )
        },
      },
      {
        title: 'Tokenid',
        dataIndex: 'id',
        render(text: string) {
          return `#${text}`
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
          return <DogLink route to={`/address/${text}`} is-copy label={omitCenterString(text)} value={text}></DogLink>
        },
      },
      {
        title: 'Receiver',
        dataIndex: 'receiver',
        render(text: string) {
          return <DogLink route to={`/address/${text}`} is-copy label={omitCenterString(text)} value={text}></DogLink>
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

    const columns = ref(originColumns)

    function nextPage(pageNumber: number) {
      page.value = pageNumber
      getData()
    }

    async function getData(isReload = false) {
      loading.value = true
      try {
        if (isReload) {
          page.value = 1
        }
        const res = await queryTransferByTxid({
          txid: props.txid,
          pageSize: 15,
          page: page.value,
        })
        total.value = res.data.total
        data.value = res.data.data.map((item: { content: string }) => {
          const content = JSON.parse(item.content)
          const contentTxid = content.txid
          const { baseuri } = setCollectionLogo({ txid: contentTxid })
          delete content.txid
          return Object.assign(item, content, { baseuri, contentTxid })
        })

        console.log('transfer', data.value)

        const collInfo = setCollectionLogo({ txid: props.txid })
        if (!collInfo.baseuri) {
          columns.value = originColumns.filter((item) => item.title != 'Item')
        } else {
          columns.value = originColumns
        }
      } catch (e: unknown) {
        props.error?.(e as Error)
      } finally {
        loading.value = false
      }
    }

    expose({
      reload: () => getData(true),
    })

    return () => <DogTable rowkey="txid" loading={loading.value} dataSource={data.value} columns={columns.value} currentPage={page.value} total={total.value} onCurrent-change={nextPage} />
  },
})
