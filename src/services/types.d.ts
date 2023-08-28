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
