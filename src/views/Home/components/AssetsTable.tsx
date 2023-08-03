import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import { queryAssetsByTxid } from '@/services/nft'
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
  setup(props, { expose, emit }) {
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
        title: 'Item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_text: unknown, r: any) => {
          return (
            <>
              {r.txid && (
                <el-image
                  v-slots={{ error: () => <div class="el-image__error">#{r.tokenid}</div> }}
                  style="width: 40px; height: 40px; border-radius: 5px"
                  src={`${r.baseuri}/${r.txid}/${r.tokenid}.png`}
                  fit="cover"
                ></el-image>
              )}
            </>
          )
        },
      },
      {
        title: 'Tokenid',
        dataIndex: 'tokenid',
        width: '350px',
        render(text: string) {
          return text && `#${text}`
        },
      },
      {
        title: 'Address',
        dataIndex: 'address',
        render(text: string) {
          return <DogLink is-copy label={text} value={text}></DogLink>
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
        const res = await queryAssetsByTxid({
          txid: props.txid,
          pageSize: 15,
          page: page.value,
        })
        total.value = res.data.total
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.value = setCollectionLogo(res.data.data.map((d: any) => Object.assign(d, { txid: props.txid })))
        console.log('assets', data.value)
      } catch (e: unknown) {
        props.error?.(e as Error)
        throw e
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
