export interface TokenSwapInfo {
  pooladdress: string
  poolid: string
  tokenA: string
  tokenB: string
}

export interface TokenInfo {
  amount: number | ''
  min?: number
  isSelectToken?: boolean
  currentPool?: TokenSwapInfo
  loading?: boolean
  pools: any
  price: number
  swapType: 'SWAP_A_B' | 'SWAP_B_A'
  txid?: string
}

export type TokenInputName = 'pay' | 'rev' | ''

export type TokenState = {
  balanceA: number
  balanceB: number
  blockno: number
}

export type ResultToken<D = any> = {
  data: D
  status: 'success' | 'fail'
}

export interface SwordPool {
  pooladdress: string
  poolid: string
  status: string
  tokenA: string
  tokenB: string
  liq_avaiable: boolean
  swap_avaiable: boolean
}
