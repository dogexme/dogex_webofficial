import { PageResult } from './../types.d'
// import { CollInfo, RequestPageParams } from '@/types'
import axios from 'axios'

/**
 * 获取代币池
 */
export const queryPools = () => {
  return axios.get('https://raw.githubusercontent.com/dpalwallet/conf/main/swardpool.json')
}

/**
 * 获取代币最新金额
 */
export const queryPoolState = (poolid: string) => {
  return axios.get<ResultToken<TokenState>>('https://t26o6gfqyj.execute-api.ap-northeast-1.amazonaws.com/pool-beta/api?method=pool_state', {
    params: { poolid }
  })
}

/**
 * 获取代币交易记录
 */
export const queryTransaction = (params: { blockno: number, hash: string }) => {
  return axios.get('/api/sword/queryTransaction', {
    params
  })
}

/**
 * 查询某个交易池子的所有交易数据
 */
export const queryPoolTransactionList = (params: { pair: string } & PageResult) => {
  return axios.get('/api/sword/queryTransaction', {
    params
  })
}

/**
 * 查询池子交易记录
 */
export const queryPoolTransfers = (params: { address?: string }) => {
  return axios.get('https://t26o6gfqyj.execute-api.ap-northeast-1.amazonaws.com/pool-beta/api?method=pool_txs', {
    params
  })
}
