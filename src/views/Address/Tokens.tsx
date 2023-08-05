import DogCard from '@/components/DogCard.vue'
import DogList from '@/components/DogList'
import DogTokenItem from '@/components/DogTokenItem.vue'
import { queryAdrTokensByHash } from '@/services/nft'
import s from './index.module.scss'

export default defineComponent({
  setup() {
    const { params } = useRoute()
    const { txid, address } = params as { txid: string; address: string }
    const data = ref([])
    const total = ref(0)
    const page = ref(1)
    const loading = ref(false)
    const defaultPageSize = 24

    async function getData() {
      try {
        loading.value = true
        const res = await queryAdrTokensByHash({
          page: page.value,
          pageSize: defaultPageSize,
          txid,
          address,
        })
        data.value = setCollectionLogo(res.data.data)
        total.value = res.data.total
      } finally {
        loading.value = false
      }
    }

    function changePage(pageNumber: number) {
      page.value = pageNumber
      getData()
    }

    onMounted(() => getData())

    return () => (
      <DogCard is-back title="Address Detail">
        <DogList
          dataSource={data.value}
          currentPage={page.value}
          defaultPageSize={defaultPageSize}
          loading={loading.value}
          total={total.value}
          onCurrent-change={changePage}
          v-slots={{
            default: (dataSource: [{ tokenid: string; txid: string; baseuri: string }]) => (
              <div class={s['dog-token-grid']}>
                {dataSource.map(({ tokenid, txid, baseuri }) => (
                  <DogTokenItem key={tokenid} tokenId={tokenid} owner={address} baseUrl={baseuri} imgSrc={`${baseuri}/${txid}/${tokenid}.png`}></DogTokenItem>
                ))}
              </div>
            ),
          }}
        ></DogList>
      </DogCard>
    )
  },
})
