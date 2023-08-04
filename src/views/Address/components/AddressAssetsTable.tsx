import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import DogCollValid from '@/components/DogCollValid.vue'
import { queryAdrCollections } from '@/services/nft'
import { ElImage, ElIcon } from 'element-plus'
import { View } from '@element-plus/icons-vue'

export default defineComponent({
  props: {
    address: {
      type: String,
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
            <DogCollValid>
              <ElImage v-slots={{ error: () => <div class="el-image__error">{r.tick}</div> }} style="width: 40px; height: 40px; border-radius: 5px" src={r.logo} fit="cover"></ElImage>
            </DogCollValid>
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
        title: 'Tick',
        dataIndex: 'tick',
      },
      {
        title: 'Token Count',
        dataIndex: 'tokenCount',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(text: number, r: any) {
          return (
            <router-link style="display:flex;align-items: center" to={`/tokens/${props.address}/${r.txid}`}>
              {numberFormat(text)}
              <ElIcon style="font-size: 18px;margin-left:7px;">
                <View />
              </ElIcon>
            </router-link>
          )
        },
      },
      {
        title: 'Date',
        dataIndex: 'date',
        render(text: string) {
          return text && dateFormat(new Date(text))
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
        const res = await queryAdrCollections({
          address: props.address,
          pageSize: 15,
          page: page.value,
        })
        total.value = res.data.total
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.value = setCollectionLogo(res.data.data)
        console.log(data.value)
        // console.log('assets', data.value)
      } catch (e: unknown) {
        props.error?.(e as Error)
      } finally {
        loading.value = false
      }
    }

    getData()

    expose({
      reload: getData,
    })

    return () => <DogTable loading={loading.value} dataSource={data.value} columns={columns} currentPage={page.value} total={total.value} onCurrent-change={nextPage} />
  },
})
