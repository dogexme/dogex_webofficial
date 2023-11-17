import DogCard from '@/components/DogCard.vue'
import DogList from '@/components/DogList'
import DogTokenItem from '@/components/DogTokenItem.vue'
import { queryAdrTokensByHash } from '@/services/nft'
import s from './index.module.scss'

export default defineComponent({
  setup() {
    const { params } = useRoute()
    const { txid, address } = params as { txid: string; address: string }
    const defaultPageSize = 24

    const { dataSource, total, page, loading, query } = useTable({
      api: getData,
      pageSize: defaultPageSize,
    })

    async function getData(page: number, pageSize: number) {
      const res = await queryAdrTokensByHash({
        page,
        pageSize,
        txid,
        address,
      })
      total.value = res.data.total
      return {
        total: res.data.total,
        data: setCollectionLogo(res.data.data),
      }
    }

    return () => (
      <DogCard is-back title="Assets">
        <DogList
          dataSource={dataSource.value}
          currentPage={page.value}
          defaultPageSize={defaultPageSize}
          loading={loading.value}
          total={total.value}
          onCurrent-change={query}
          onRefresh={() => query(page.value)}
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
