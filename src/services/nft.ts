import axios from 'axios'

// 添加请求拦截器
axios.interceptors.request.use(
  async function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

/**
 * 查询集合
 * @param txid
 */
export function queryColl(txid: string) {
  return axios.get<CollInfo[]>('https://p2vpvyhw00.execute-api.ap-east-1.amazonaws.com/beta/api', {
    params: { txid },
  })
}

/**
 * 查询集合下holders
 */
export function queryHoldersByTxid(params: PageResult & { txid: string }) {
  return axios.get('https://u4d9olw81e.execute-api.ap-east-1.amazonaws.com/beta/api', {
    params,
  })
}

/**
 * 查询集合的所有交易
 */
export function queryTransferByTxid(params: PageResult & { txid: string }) {
  return axios.get('https://l8bhelwrlg.execute-api.ap-east-1.amazonaws.com/beta/api', {
    params,
  })
}

/**
 * 用户持有该集合所有资产
 */
export function queryAssetsByTxid(params: PageResult & { txid: string }) {
  return axios.get('https://cy0ol5pah0.execute-api.ap-east-1.amazonaws.com/beta/api', {
    params,
  })
}

/**
 * 集合映射表
 */
export function collMap() {
  return axios.get('https://raw.githubusercontent.com/dpalwallet/conf/main/nft.json')
}
