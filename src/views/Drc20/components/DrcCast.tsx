import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import DogCollValid from '@/components/DogCollValid.vue'
import { ElImage } from 'element-plus'
import { queryCastLightList } from '@/services/nft'
import { setCollectionLogo, numberFormat } from '@/utils'

export default defineComponent({
  emits: ['search'],
  setup(_props, { emit }) {
    const pageSize = 20
    const { dataSource, total, page, loading, query } = useTable({
      api: getData,
      pageSize,
    })

    function handleClickTxid(e: string) {
      emit('search', e)
    }

    const columns = [
      {
        title: 'Logo',
        dataIndex: 'logo',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (logo: string, r: any) => {
          return (
            <DogCollValid show={r.valid == 0}>
              {logo ? <ElImage v-slots={{ error: () => <div class="el-image__error">{r.tick}</div> }} style="width: 40px; height: 40px; border-radius: 5px" src={logo} fit="cover"></ElImage> : r.tick}
            </DogCollValid>
          )
        },
      },
      {
        title: 'Txid',
        dataIndex: 'txid',
        render(text: string) {
          return <>{text && <DogLink onClick={handleClickTxid} is-copy style="cursor: pointer;" label={omitCenterString(text, 24)} value={text}></DogLink>}</>
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
        title: 'Max',
        dataIndex: 'max',
        render(text: number) {
          return numberFormat(text)
        },
      },
      {
        title: 'Mintval',
        dataIndex: 'mintval',
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

    async function getData(page: number, pageSize: number) {
      const res = await queryCastLightList({
        pageSize,
        page,
      })

      return {
        total: res.data.total,
        // eslint-disablenext-line @typescript-eslint/no-explicit-any
        data: res.data.data.map((item: any) => {
          const { logo, valid } = setCollectionLogo({ txid: item.txid })
          return Object.assign(item, { logo, valid })
        }),
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
      />
    )
  },
})
