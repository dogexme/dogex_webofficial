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
        return <SwapIconPool iconA={props.tokenA} iconB={props.tokenB} token={token}></SwapIconPool>
      } else {
        return swapType
      }
    }
  },
})
