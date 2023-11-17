import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
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
    const { dataSource, total, page, loading, query } = useTable({
      api: getData,
    })

    watch(loading, (isLoading) => {
      emit('update:isLoading', isLoading)
    })

    const columns = [
      {
        title: 'Item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_text: unknown, r: any) => {
          return <ElImage v-slots={{ error: () => <div class="el-image__error">{r.tick}</div> }} style="width: 40px; height: 40px; border-radius: 5px" src={r.logo} fit="cover"></ElImage>
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
            <div style="display:flex;align-items: center">
              {text}
              <router-link to={`/tokens/${props.address}/${r.txid}`}>
                <ElIcon style="font-size: 18px;margin-left:7px;">
                  <View />
                </ElIcon>
              </router-link>
            </div>
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

    async function getData() {
      return {
        total: 0,
        data: [],
      }
    }

    expose({
      reload: (page.value = 1),
    })

    return () => <DogTable loading={loading.value} dataSource={dataSource.value} columns={columns} currentPage={page.value} total={total.value} onCurrent-change={query} />
  },
})
