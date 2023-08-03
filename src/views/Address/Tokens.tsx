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

    async function getData() {
      try {
        loading.value = true
        const res = await queryAdrTokensByHash({
          page: page.value,
          pageSize: 15,
          txid,
          address,
        })
        data.value = setCollectionLogo(res.data.data)
        console.log(data.value)
        total.value = res.data.total
      } finally {
        loading.value = false
      }
    }
    getData()

    return () => (
      <DogCard is-back title="Address Details">
        <DogList currentPage={page.value} defaultPageSize={15} loading={loading.value} total={total.value}>
          <div class={s['dog-token-grid']}>
            {data.value.map(({ tokenid, txid, baseuri }) => (
              <DogTokenItem tokenId={tokenid} owner={txid} baseUrl={baseuri} imgSrc={`${baseuri}/${txid}/${tokenid}.png`}></DogTokenItem>
            ))}
          </div>
        </DogList>
      </DogCard>
    )
  },
})
