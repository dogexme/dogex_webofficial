import DogPageHeader from '@/components/DogPageHeader.vue'
import DogTokenBuyItem from '@/components/DogTokenBuyItem.vue'
import DogList from '@/components/DogList'
import s from './index.module.scss'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()

    const columns = [
      {
        title: 'Collection',
        dataIndex: 'collection',
      },
      {
        title: 'Floor Price',
        dataIndex: 'floorPrice',
      },
      {
        title: 'Unit Price',
        dataIndex: 'unitPrice',
      },
      {
        title: 'Listed',
        dataIndex: 'listed',
      },
    ]

    async function api(page: number, pageSize: number) {
      return {
        data: [
          { collection: 'dogim', floorPrice: 12, unitPrice: 132, listed: 789 },
          { collection: 'dogetomoon', floorPrice: 132, unitPrice: 1231, listed: 32 },
          { collection: 'owls', floorPrice: 31, unitPrice: 112, listed: 35 },
          { collection: 'dogecheck', floorPrice: 231, unitPrice: 123, listed: 42 },
        ],
        total: 1,
      }
    }

    const defaultPageSize = 15

    const { loading, dataSource, page, total, query, refresh } = useTable({
      api,
      pageSize: 15
    })

    return () => (
      <div>
        <DogPageHeader isBack title="Tokens / Detail"></DogPageHeader>
        <DogList
          dataSource={dataSource.value}
          currentPage={page.value}
          defaultPageSize={defaultPageSize}
          loading={loading.value}
          total={total.value}
          onCurrent-change={query}
          onRefresh={refresh}
          v-slots={{
            default: (dataSource: [{ tokenid: string; txid: string; baseuri: string }]) => (
              <div class={s['dog-token-grid']}>
                {dataSource.map(() => (
                  <DogTokenBuyItem ></DogTokenBuyItem>
                ))}
              </div>
            ),
          }}
        ></DogList>
      </div>
    )
  },
})
