import { PageResult } from './../types.d'
// import { CollInfo, RequestPageParams } from '@/types'
import axios from 'axios'

/**
 * 获取代币池
 */
export const queryPools = () => {
  return axios.get('/api/sword/queryPools')
}

/**
 * 获取代币最新金额
 */
export const queryPoolState = (params: { pari: string }) => {
  return axios.get('/api/sword/queryPoolState', {
    params
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
