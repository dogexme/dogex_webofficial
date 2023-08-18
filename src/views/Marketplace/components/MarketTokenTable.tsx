import DogTable from '@/components/DogTable/DogTable'

export default defineComponent({
  setup() {
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
    ]

    async function api(page: number, pageSize: number) {
      console.log(page, pageSize)
      return {
        data: [
          { collection: 1, floorPrice: 1, unitPrice: 1 },
          { collection: 1, floorPrice: 1, unitPrice: 1 },
        ],
        total: 1,
      }
    }

    const { loading, dataSource, page, total, query } = useTable({
      api,
    })

    function nextPage(page: number) {
      query(page)
    }

    return () => <DogTable loading={loading.value} dataSource={dataSource.value} columns={columns} currentPage={page.value} total={total.value} onCurrent-change={nextPage} />
  },
})
