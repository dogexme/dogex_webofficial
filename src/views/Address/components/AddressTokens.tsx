import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import { ElImage } from 'element-plus'
import { getTransferList } from '@/services/sword'
import icon from '@/config/payIcons'

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
    const { dataSource, page, total, loading, query } = useTable({
      api: getData,
    })

    watch(loading, (isLoading) => {
      emit('update:isLoading', isLoading)
    })

    const columns = [
      {
        title: 'token',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render() {
          return <ElImage v-slots={{ error: () => <div class="el-image__error">dogim</div> }} style="width: 40px; height: 40px; border-radius: 5px" src={icon.dogim} fit="cover"></ElImage>
        },
      },
      {
        title: 'Txid',
        dataIndex: 'txid',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(text: string, r: any) {
          return <>{text && <DogLink route is-copy to={`/tokens/${props.address}/${r.txid}`} label={omitCenterString(text, 24)} value={text}></DogLink>}</>
        },
      },
      {
        title: 'amount',
        dataIndex: 'amt',
        render(amt: number) {
          return numberFormat(amt)
        },
      },
    ]

    async function getData() {
      try {
        const res = await getTransferList(props.address)
        return {
          total: res.data.total || 1,
          data: res.data.data.transfer_list,
        }
      } catch (e: unknown) {
        props.error?.(e as Error)
        throw e
      }
    }

    expose({
      reload: (page.value = 1),
    })

    return () => (
      <DogTable loading={loading.value} dataSource={dataSource.value} columns={columns} currentPage={page.value} total={total.value} onCurrent-change={query} onRefresh={() => query(page.value)} />
    )
  },
})
