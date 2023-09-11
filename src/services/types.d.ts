interface TokenSwapInfo {
  pooladdress: string
  poolid: string
  tokenA: string
  tokenB: string
}

interface TokenInfo {
  amount: number | ''
  rate: number
  min?: number
  isSelectToken?: boolean
  currentPool?: TokenSwapInfo
  loading?: boolean,
  pools: any,
  price: number,
  swapType: 'SWAP_A_B' | 'SWAP_B_A'
}

type TokenInputName = 'pay' | 'rev' | ''

type TokenState = {
  balanceA: number
  balanceB: number
  blockno: number
}

type ResultToken<D = any> = {
  data: D,
  status: 'success' | 'fail'
}

interface SwordPool {
  pooladdress: string
  poolid: string
  status: string
  tokenA: string
  tokenB: string
}
