import DogTable from '@/components/DogTable/DogTable'

export default defineComponent({
  setup() {
    const router = useRouter()
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
      console.log(page, pageSize)
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

    const { loading, dataSource, page, total, query, refresh } = useTable({
      api,
    })

    function nextPage(page: number) {
      query(page)
    }

    function handleRowClick(r: any) {
      console.log(r)
      router.push({
        name: 'marketTokens',
        query: {
          hash: 123,
        },
      })
    }

    return () => (
      <DogTable
        rowClick
        loading={loading.value}
        dataSource={dataSource.value}
        columns={columns}
        currentPage={page.value}
        total={total.value}
        onCurrent-change={nextPage}
        onRow-click={handleRowClick}
        onRefresh={refresh}
      />
    )
  },
})
