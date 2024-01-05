declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DogeApi: any
  }
}

type PageParams = {
  pageSize: number
  page: number
}

export type PageResult = PageParams

export interface CollInfo {
  tick: string
  max: number
  buri: string
  deployer: string
  mintval: number
  date: string
  holders: number
  logo: string
  valid: number
}

export type CollInfoType = 'overview' | 'holders' | 'transfers' | 'assets'

export type RequestPageParams = Partial<PageParams & { txid?: string }>

export type TokenMarketInfo = {
  block_no: number
  price: number
  upordown: number
}

export enum KlineType {
  _10m = '10m',
  _1h = '1h',
  _12h = '12h',
  _1d = '1d',
}
