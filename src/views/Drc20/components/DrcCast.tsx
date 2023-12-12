import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import { numberFormat } from '@/utils'
import { queryDrcList } from '@/services/drc'
import { ElImage } from 'element-plus'

export default defineComponent({
  emits: ['search'],
  setup() {
    const pageSize = 20
    const { dataSource, total, page, loading, query } = useTable({
      api: getData,
      pageSize,
    })
    const router = useRouter()

    const columns = [
      {
        title: 'Logo',
        dataIndex: 'logo',
        render: (_: string, r: any) => {
          return (
            <ElImage
              v-slots={{ error: () => <div class="el-image__error">{r.tick}</div> }}
              style="width: 40px; height: 40px; border-radius: 5px"
              src={`https://raw.githubusercontent.com/dpalwallet/logoasserts/main/asserts/${r.tick == 'dogi' ? 'dogim' : r.tick}.png`}
              fit="cover"
            ></ElImage>
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
      const res = await queryDrcList({
        pageSize,
        page,
      })

      return {
        total: res.data.total || 1,
        data: res.data.data,
      }
    }

    return () => (
      <DogTable
        rowkey="txid"
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
