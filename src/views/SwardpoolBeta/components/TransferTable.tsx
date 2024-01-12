import DogTable, { ColumnProps } from '@/components/DogTable/DogTable'
import DogLink from '@/components/DogLink.vue'
import SwapStatusIcon from '@/components/SwapStatusIcon.vue'
import SwapTypeIcon from '@/components/SwapTypeIcon'
import DogSearch from '@/components/DogSearch.vue'
import { getBalanceByPoolAddress, queryPoolTransfers } from '@/services/sword'
import { PropType } from 'vue'
import { numberFormat } from '@/utils'
import { SwordPool } from '@/services/types'
import { getTokenIcon } from '@/config/payIcons'
import NP from 'number-precision'

export function consumeNumFormat(num: number, tokenName?: string) {
  return !Number(num) ? 0 : `${numberFormat(num)} ${tokenName}`
}

export const StatusType = {
  0: 'pending',
  1: 'success',
  2: 'fail',
}

export function getSwapType(swapType: string, tokenA?: string, tokenB?: string) {
  if (swapType == 'SWAP_B_A') {
    return `Swap ${tokenB} for ${tokenA}`
  } else if (swapType == 'SWAP_A_B') {
    return `Swap ${tokenA} for ${tokenB}`
  } else if (swapType == 'ROLLBACK_A' || swapType == 'ROLLBACK_B') {
    return 'ROLLBACK'
  } else {
    return swapType
  }
}

export function consumeToken(swapType: string, tokenANum: number, tokenBNum: number, tokenA?: string, tokenB?: string, isIn = true) {
  if (swapType == 'SWAP_A_B') {
    return isIn ? consumeNumFormat(tokenANum, tokenA) : consumeNumFormat(tokenBNum, tokenB)
  } else if (swapType == 'SWAP_B_A') {
    return isIn ? consumeNumFormat(tokenBNum, tokenB) : consumeNumFormat(tokenANum, tokenA)
  }

  if (swapType == 'ROLLBACK_A') {
    return consumeNumFormat(tokenANum, tokenA)
  } else if (swapType == 'ROLLBACK_B') {
    return consumeNumFormat(tokenBNum, tokenB)
  }

  return tokenANum > 0 ? consumeNumFormat(tokenANum, tokenA) : consumeNumFormat(tokenBNum, tokenB)
}

export default defineComponent({
  props: {
    currentPool: {
      type: Object as PropType<SwordPool>,
    },
  },
  setup(props, { expose }) {
    const { loading, dataSource, total, page, query, disabledSlide } = useTable({
      first: false,
      api: getData,
      pageSize: 20,
    })

    const params = reactive({
      address: '',
    })

    function SwapStatusItem(text: '0' | '1' | '2') {
      return <SwapStatusIcon status={text}></SwapStatusIcon>
    }

    const originColumns: ColumnProps[] = [
      {
        title: 'Block No',
        dataIndex: 'blockno',
      },
      {
        title: 'Swap',
        align: 'center',
        render(_text: any, r: any) {
          return (
            <SwapTypeIcon swapType={r.swapType} record={r} tokenA={props.currentPool!.tokenA} tokenB={props.currentPool!.tokenB}></SwapTypeIcon>
          )
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(text: '0' | '1' | '2') {
          return SwapStatusItem(text) || '-'
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
        title: 'In',
        render(_text: any, r: any) {
          return consumeToken(r.swapType, r.inTokenA, r.inTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB)
        },
      },
      {
        title: 'Out',
        render(_text: any, r: any) {
          return consumeToken(r.swapType, r.outTokenA, r.outTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB, false)
        },
      },
      {
        title: 'Price',
        render(_text: any, r: any) {
          return 'Ð ' + NP.round(r.balanceB == 0 ? 0 : NP.divide(r.balanceA, r.balanceB), 4)
        },
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
          return (
            <>{text ? <DogLink is-copy to={`https://chain.so/tx/DOGE/${text}`} label={omitCenterString(text, 12)} value={text}></DogLink> : '-'}</>
          )
        },
      },
      {
        title: 'Balance',
        dataIndex: 'balanceA',
        render(balanceA: number) {
          return `${numberFormat(balanceA)} ${props.currentPool?.tokenA}`
        },
      },
      {
        title: 'Balance',
        dataIndex: 'balanceB',
        render(balanceA: number) {
          return `${numberFormat(balanceA)} ${props.currentPool?.tokenB}`
        },
      },
      {
        title: 'Gas',
        dataIndex: 'gas',
      },
    ]

    const columns = ref(originColumns)

    watch(
      () => props.currentPool?.pooladdress,
      () => {
        query(1)
      }
    )

    async function getData(page: number, pageSize: number) {
      const res = await queryPoolTransfers({ pageSize, page, address: params.address })
      const { status, data } = res.data
      return status == 'success'
        ? {
            total: data.total,
            data: data.list,
          }
        : {
            total: 0,
            data: [],
          }
    }

    const balance = ref(0)

    const controller = ref()
    async function getBanlance() {
      controller.value?.abort()
      controller.value = new AbortController()
      const res = await getBalanceByPoolAddress(params.address, {
        signal: controller.value.signal,
      })
      const data = res.data
      if (data.length) {
        balance.value = data[0]?.balance || 0
      } else {
        balance.value = 0
      }
    }

    let isLoaded = false

    expose({
      load: async () => {
        if (isLoaded) {
          return
        }
        await query(1, true)
        isLoaded = true
      },
    })

    return () => (
      <DogTable
        defaultPageSize={20}
        rowkey="id"
        loading={loading.value}
        dataSource={dataSource.value}
        columns={columns.value}
        total={total.value}
        currentPage={page.value}
        onCurrent-change={query}
        onRefresh={() => query(page.value)}
        disabledSlide={disabledSlide.value}
        v-slots={{
          tooltipLeft() {
            return (
              <div class="flex">
                <DogSearch
                  style="max-width: 300px"
                  v-model={params.address}
                  loading={loading.value}
                  onSearch={() => {
                    query(1, true)
                    getBanlance()
                  }}
                  onClear={() => {
                    params.address = ''
                    balance.value = 0
                    controller.value?.abort()
                    query(1, true)
                  }}
                ></DogSearch>
                {balance.value > 0 && (
                  <div class="flex flex-1 items-center ml-3 text-xs">
                    <img class="mr-2" style={{ borderRadius: '50%', width: '16px' }} src={getTokenIcon('dogim')} alt="" />
                    {numberFormat(balance.value)}
                  </div>
                )}
              </div>
            )
          },
        }}
      />
    )
  },
})
