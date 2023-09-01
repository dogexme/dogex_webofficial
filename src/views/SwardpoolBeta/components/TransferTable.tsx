import DogTable from '@/components/DogTable/DogTable'
import DogLink from '@/components/DogLink.vue'
import { queryPoolTransfers } from '@/services/sword'
import { PropType } from 'vue'
import {numberFormat} from '@/utils'

export function getSwapType(swapType: string, tokenA?: string, tokenB?: string) {
  if (swapType == 'SWAP_B_A') {
    return `Swap ${tokenB} for ${tokenA}`
  } else if (swapType == 'SWAP_A_B'){
    return `Swap ${tokenA} for ${tokenB}`
  } else if(swapType == 'ROLLBACK_A' || swapType == 'ROLLBACK_B') {
    return 'ROLLBACK'
  } else {
    return swapType
  }
}

export function consumeToken(tokenANum: number, tokenBNum: number, tokenA?: string, tokenB?: string) {
  return tokenANum > 0 ? `${numberFormat(tokenANum)} ${tokenA}` : `${numberFormat(tokenBNum)} ${tokenB}`
}

export default defineComponent({
  props: {
    currentPool: {
      type: Object as PropType<SwordPool>
    }
  },
  setup(props) {
    const statusType = {
      0: 'waiting',
      1: 'success',
      2: 'fail'
    }

    const { loading, dataSource, total, page, query } = useTable({
      api: getData,
      pageSize: 20,
    })

    const originColumns = [
      {
        title: 'Block No',
        dataIndex: 'blockno',
      },
      // {
      //   title: 'Order Id',
      //   dataIndex: 'id'
      // },
      {
        title: 'Swap',
        render(_text: any, r: any) {
          return getSwapType(r.swapType, props.currentPool?.tokenA, props.currentPool?.tokenB)
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(text: 0 | 1 | 2) {
          return statusType[text] || '-'
        }
      },
      {
        title: 'Txid',
        dataIndex: 'txid',
        render(text: string) {
          return <>{text && <DogLink is-copy to={`https://chain.so/tx/DOGE/${text}`} label={omitCenterString(text, 12)} value={text}></DogLink>}</>
        },
      },
      {
        title: 'Processed Txid',
        dataIndex: 'processedTxid',
        render(text: string) {
          return <>{text ? <DogLink is-copy to={`https://chain.so/tx/DOGE/${text}`} label={omitCenterString(text, 12)} value={text}></DogLink> : '-'}</>
        },
      },
      {
        title: 'Address',
        dataIndex: 'address',
        render(text: string) {
          return <DogLink is-copy label={omitCenterString(text, 12)} value={text}></DogLink>
        },
      },
      {
        title: 'Balance',
        dataIndex: 'balanceA',
        render(balanceA: number) {
          return `${numberFormat(balanceA)} ${props.currentPool?.tokenA}`
        }
      },
      {
        title: 'Balance',
        dataIndex: 'balanceB',
        render(balanceA: number) {
          return `${numberFormat(balanceA)} ${props.currentPool?.tokenB}`
        }
      },
      {
        title: 'Gas',
        dataIndex: 'gas',
      },
      {
        title: 'In',
        render(_text: any, r: any) {
          return consumeToken(r.inTokenA, r.inTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB)
        }
      },
      {
        title: 'Out',
        render(_text: any, r: any) {
          return consumeToken(r.outTokenA, r.outTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB)
        }
      },
      // {
      //   title: 'Old BalanceA',
      //   dataIndex: 'old_balance_a',
      // },
      // {
      //   title: 'Old BalanceB',
      //   dataIndex: 'old_balance_b',
      // },
    ]

    const columns = ref(originColumns)

    watch(() => props.currentPool?.pooladdress, () => {
      query(1)
    })

    async function getData(page: number, pageSize: number) {
      const res = await queryPoolTransfers({ pageSize, page })
      const { status, data } = res.data
      return status == 'success' ? {
        total: data.total,
        data: data.list
      } : {
        total: 0,
        data: []
      }
    }

    return () => <DogTable defaultPageSize={20} rowkey="id" loading={loading.value} dataSource={dataSource.value} columns={columns.value} total={total.value} currentPage={page.value} onCurrent-change={query} onRefresh={() => query(page.value)}/>
  },
})
