import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import { numberFormat } from '@/utils'
import { queryUnlist } from '@/services/drc'
import { ElImage, ElOption, ElSelect } from 'element-plus'
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
    const len = ref(4)
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
        title: 'Lim',
        dataIndex: 'lim',
        render(text: number) {
          return numberFormat(text)
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
        title: 'Block',
        dataIndex: 'block',
      },
      {
        title: 'Txid',
        dataIndex: 'txid',
        render(text: string) {
          return <>{text && <DogLink is-copy style="cursor: pointer;" label={omitCenterString(text, 24)} value={text}></DogLink>}</>
        },
      },
    ]

    watch(len, () => query(1, true))

    function rowClick(drc: any) {
      router.push(`/drc20/item/${drc.tick}?type=unlist`)
    }

    async function getData(page: number, pageSize: number) {
      emit('update:loading', true)
      try {
        const res = await queryUnlist({
          len: len.value,
          pageSize,
          page,
        })

        return {
          total: res.data.data?.total || 1,
          data: res.data.data?.list || [],
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
        v-slots={{
          tooltipLeft: () => (
            <div class="flex items-center">
              <span class="text-xs whitespace-nowrap mr-2">Tick Length: </span>
              <ElSelect v-model={len.value} collapse-tags placeholder="Tick length" style="width: 80px">
                {Array.from({ length: 3 }).map((_, i) => {
                  return <ElOption key={i} label={i + 4} value={i + 4}></ElOption>
                })}
              </ElSelect>
            </div>
          ),
        }}
      ></DogTable>
    )
  },
})
