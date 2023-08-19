import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import DogCollValid from '@/components/DogCollValid.vue'
import { queryAdrCollections } from '@/services/nft'
import { ElImage } from 'element-plus'

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
    const {dataSource, page, total, loading, query} = useTable({
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
          return (
            <DogCollValid show={r.valid == 0}>
              <ElImage v-slots={{ error: () => <div class="el-image__error">{r.tick}</div> }} style="width: 40px; height: 40px; border-radius: 5px" src={r.logo} fit="cover"></ElImage>
            </DogCollValid>
          )
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
        title: 'Tick',
        dataIndex: 'tick',
      },
      {
        title: 'Token Count',
        dataIndex: 'tokenCount',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(text: number) {
          return numberFormat(text)
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

    async function getData(page: number, pageSize: number) {
      try {
        const res = await queryAdrCollections({
          address: props.address,
          pageSize,
          page,
        })

        return {
          total: res.data.total,
          data: setCollectionLogo(res.data.data)
        }
      } catch (e: unknown) {
        props.error?.(e as Error)
        throw e
      }
    }

    expose({
      reload: page.value = 1,
    })

    return () => <DogTable loading={loading.value} dataSource={dataSource.value} columns={columns} currentPage={page.value} total={total.value} onCurrent-change={query} />
  },
})
