import DogLink from '@/components/DogLink.vue'
import DogTable from '@/components/DogTable/DogTable'
import { ElImage } from 'element-plus'
import { queryTransferByTxid } from '@/services/nft'
import { setCollectionLogo } from '@/utils'

export default defineComponent({
  props: {
    tickInfo: {
      type: Object,
    },
  },
  setup(props, { expose }) {
    const { dataSource, loading, total, page, query } = useTable({
      api: getData,
      pageSize: 15,
      first: false,
    })

    const originColumns = [
      {
        title: 'Txid',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_text: unknown, r: any) => {
          return (
            <>
              {r.id && (
                <ElImage
                  v-slots={{ error: () => <div class="el-image__error">#{r.id}</div> }}
                  style="width: 40px; height: 40px; border-radius: 5px"
                  src={`${r.baseuri}/${r.contentTxid}/${r.id}.png`}
                  fit="cover"
                ></ElImage>
              )}
            </>
          )
        },
      },
      {
        title: 'Sender',
        dataIndex: 'sender',
        render(text: string) {
          return <DogLink route to={`/address/${text}`} is-copy label={omitCenterString(text)} value={text}></DogLink>
        },
      },
      {
        title: 'Receiver',
        dataIndex: 'receiver',
        render(text: string) {
          return <DogLink route to={`/address/${text}`} is-copy label={omitCenterString(text)} value={text}></DogLink>
        },
      },
      {
        title: 'Amt',
        dataIndex: 'amt',
      },
    ]

    const columns = ref(originColumns)

    async function getData(page: number, pageSize: number) {
      try {
        const res = await queryTransferByTxid({
          txid: props.txid,
          pageSize,
          page,
        })

        const data = res.data.data.map((item: { content: string }) => {
          const content = JSON.parse(item.content)
          const contentTxid = content.txid
          const { baseuri } = setCollectionLogo({ txid: contentTxid })
          delete content.txid
          return Object.assign(item, content, { baseuri, contentTxid })
        })

        const collInfo = setCollectionLogo({ txid: props.txid })
        if (!collInfo.baseuri) {
          columns.value = originColumns.filter((item) => item.title != 'Item')
        } else {
          columns.value = originColumns
        }

        return {
          total: res.data.total,
          data,
        }
      } catch (e: unknown) {
        props.error?.(e as Error)
        throw e
      }
    }

    const isLoaded = ref(false)

    expose({
      reload: () => {
        if (page.value == 1 && !isLoaded.value) {
          query(1)
          isLoaded.value = true
        } else {
          page.value = 1
        }
      },
      setLoad(isLoad: boolean) {
        isLoaded.value = isLoad
      },
    })

    return () => (
      <DogTable
        rowkey="txid"
        loading={loading.value}
        dataSource={dataSource.value}
        columns={columns.value}
        currentPage={page.value}
        total={total.value}
        onCurrent-change={query}
        onRefresh={() => query(page.value)}
      />
    )
  },
})
