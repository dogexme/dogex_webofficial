import DogCard from '@/components/DogCard.vue'
import DogList from '@/components/DogList'
import DogTokenItem from '@/components/DogTokenItem.vue'
import { queryAdrTokensByHash } from '@/services/nft'

export default defineComponent({
  setup() {
    const { params } = useRoute()
    const { txid, address } = params as { txid: string; address: string }
    const data = ref([])
    const total = ref(0)
    const page = ref(1)

    const columns = [
      {
        title: 'Logo',
        dataIndex: 'logo',
        render(text: string) {
          return <div>{text}</div>
        },
      },
    ]

    async function getData() {
      const res = await queryAdrTokensByHash({
        page: page.value,
        pageSize: 15,
        txid,
        address,
      })
      data.value = setCollectionLogo(res.data.data)
      data.value = Array.from({ length: 10 }).map(() => data.value[0])
    }
    getData()

    return () => (
      <DogCard is-back title="Address Details">
        <DogList currentPage={page.value} defaultPageSize={15}>
          {data.value.map(({ tokenid, txid, baseuri }) => (
            <DogTokenItem tokenId={tokenid} owner={txid} imgSrc={`${baseuri}/${txid}/${tokenid}.png`}></DogTokenItem>
          ))}
        </DogList>
      </DogCard>
    )
  },
})
