import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import { numberFormat } from '@/utils'
import { queryDrcList } from '@/services/drc'
import { ElImage, ElProgress } from 'element-plus'
import { PropType } from 'vue'
import { ListType } from './DrcCast'

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<ListType>,
    },
  },
  emits: ['search', 'update:loading'],
  setup(_, { expose, emit }) {
    const pageSize = 20
    const { dataSource, total, page, loading, query } = useTable({
      first: false,
      api: getData,
      pageSize,
    })
    const router = useRouter()

    const columns = [
      {
        title: 'Logo',
        dataIndex: 'logo',
        render: (_: string, r: any) => {
          const tick = r.tick == 'dogi' ? 'dogim' : r.tick
          return (
            <>
              {tick && (
                <ElImage
                  v-slots={{ error: () => <div class="el-image__error">{r.tick}</div> }}
                  style="width: 40px; height: 40px; border-radius: 5px"
                  src={`https://raw.githubusercontent.com/dpalwallet/logoasserts/main/asserts/${tick}.png`}
                  fit="cover"
                ></ElImage>
              )}
            </>
          )
        },
      },
      {
        title: 'Tick',
        dataIndex: 'tick',
        render(text: string) {
          return text
        },
      },
      {
        title: 'Mint',
        dataIndex: 'mintVal',
        render(mintVal: number, r: any) {
          return (
            <>
              {mintVal && (
                <div>
                  {numberFormat(mintVal)}
                  <span style="color: #606266">{`(${+((mintVal / r.max) * 100).toFixed(2)}%)`}</span>
                  <ElProgress style="width: 100%; margin-top: 5px;" stroke-width={10} percentage={+((mintVal / r.max) * 100)} show-text={false} />
                </div>
              )}
            </>
          )
        },
      },
      {
        title: 'Max',
        dataIndex: 'max',
        render(text: number) {
          return numberFormat(text)
        },
      },
      {
        title: 'Lim',
        dataIndex: 'lim',
        render(text: number) {
          return numberFormat(text)
        },
      },
      {
        title: 'Holders',
        dataIndex: 'holders',
        render(text: number) {
          return numberFormat(text)
        },
      },
      {
        title: 'Deployer',
        dataIndex: 'deployer',
        render(text: string) {
          return <DogLink route to={`/address/${text}`} is-copy label={text} value={text}></DogLink>
        },
      },
    ]

    function rowClick(drc: any) {
      router.push(`/drc20/item/${drc.tick}`)
    }

    async function getData(page: number, pageSize: number) {
      emit('update:loading', true)
      try {
        const res = await queryDrcList({
          pageSize,
          page,
        })

        return {
          total: res.data.total || 1,
          data: res.data.data,
        }
      } finally {
        emit('update:loading', false)
      }
    }

    let isLoaded = false

    expose({
      reload: async () => {
        if (isLoaded) {
          return
        }
        await query(1, true)
        isLoaded = true
      },
    })

    return () => (
      <DogTable
        rowkey="tick"
        defaultPageSize={pageSize}
        loading={loading.value}
        dataSource={dataSource.value}
        columns={columns}
        currentPage={page.value}
        total={total.value}
        onCurrent-change={query}
        onRefresh={() => query(page.value)}
        onRow-click={rowClick}
        rowClick
      />
    )
  },
})
