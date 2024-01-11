import SwapIconExchange from '@/components/SwapIconExchange.vue'
import SwapIconPool from './SwapIconPool.vue'

export default defineComponent({
  props: {
    swapType: {
      type: String,
    },
    record: {
      type: Object,
    },
    tokenA: {
      type: String,
      required: true,
    },
    tokenB: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const swapType = props.swapType
      const isRemoveLiq = swapType?.includes('REMOVELIQ')
      const isAddLiq = swapType?.includes('ADDLIQ')
      const isLiqType = isRemoveLiq || isAddLiq

      if (swapType == 'SWAP_B_A') {
        return <SwapIconExchange iconA={props.tokenB} iconB={props.tokenA} />
      } else if (swapType == 'SWAP_A_B') {
        return <SwapIconExchange iconA={props.tokenA} iconB={props.tokenB} />
      } else if (swapType == 'ROLLBACK_A' || swapType == 'ROLLBACK_B') {
        return 'ROLLBACK'
      } else if (isLiqType) {
        const token = props.record?.inTokenA > 0 ? props.tokenA : props.tokenB

        if (isRemoveLiq) {
          return (
            <SwapIconPool
              iconA={props.tokenA}
              iconB={props.tokenB}
              token={props.record?.outTokenA > 0 ? props.tokenB : props.tokenA}
              type={isAddLiq ? 0 : 1}
            ></SwapIconPool>
          )
        }

        return <SwapIconPool iconA={props.tokenA} iconB={props.tokenB} token={token} type={isAddLiq ? 0 : 1}></SwapIconPool>
      } else if (swapType == 'DUST') {
        return (
          <div class="flex flex-col items-center">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <path
                d="M320 256a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m384 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-192 32a32 32 0 1 1 0 64 32 32 0 0 1 0-64z m-192 352a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m384 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-192 32a32 32 0 1 1 0 64 32 32 0 0 1 0-64z m192-192a32 32 0 1 1 0 64 32 32 0 0 1 0-64z m-384 0a32 32 0 1 1 0 64 32 32 0 0 1 0-64z m192-32a64 64 0 1 1 0 128 64 64 0 0 1 0-128z"
                fill="black"
              ></path>
            </svg>
            <span class="text-xs text-gray-500">DUST</span>
          </div>
        )
      } else {
        return swapType
      }
    }
  },
})
