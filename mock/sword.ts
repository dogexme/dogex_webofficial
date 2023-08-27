import { MockMethod, MockConfig } from 'vite-plugin-mock'
export default [
  {
    url: '/api/sword/queryPools',
    method: 'get',
    response() {
      return {
        data: [
          {
            poolid: '池子编号，可以部署相同的池子',
            tokenA: 'doge',
            tokenB: 'dogi',
            pooladdress: '池子地址',
          },
        ],
      }
    },
  },
  {
    url: '/api/sword/queryPoolState',
    method: 'get',
    response() {
      return {
        status: 'success',
        data: {
          balanceA: 1000, // 当前池子 tokena 余额（doge余额）
          balanceB: 100000, // 当前池子 tokenb 余额
          blockno: 1000000, // 当前池子最新索引的区块
        },
      }
    },
  },
  {
    url: '/api/sword/queryTransaction',
    method: 'get',
    response() {
      return {
        status: 'success',
        data: {
          // 0 等待 1 成功 2 失败 3 会滚交易 4 粉尘交易
          status: '0',
          gas: 1, // 当前交易消耗的 gas 费用 （doge）
          id: 12, // 在区块内的顺序
          balanceA: 1000, // 当前交易后 池子内 token a 的 余额 现在 a 为 doge b 为其他代笔
          balanceB: 10000, // 当前交易后 池子内 tokenb 的 余额 现在 a 为 doge b 为其他代笔
          old_balance_a: 1000, // 该交易发生前 的池子 doge 余额
          old_balance_b: 10000, // 该交易发生前 的池子 doge 余额
          inTokenA: 0, // 这比交易输入的 token a 的数量 （doge数量）如果 intokena 等于0 intokenb > 0  表示 b 换 a 反之表示 a 换 b
          inTokenB: 12, // 这比交易输入的 token b 的数量  (dogi)
          outTokenA: 13, // 这比交易获得的 token a 的数量 （doge数量）
          outTokenB: 14, // 这比交易获得的 token b 的数量  (dogi)
        },
      }
    },
  },
  {
    url: '/api/sword/queryPoolTransactionList',
    method: 'get',
    response() {
      return {
        status: 'success',
        data: [{
          // 0 等待 1 成功 2 失败 3 会滚交易 4 粉尘交易
          status: '0',
          gas: 1, // 当前交易消耗的 gas 费用 （doge）
          id: 12, // 在区块内的顺序
          balanceA: 1000, // 当前交易后 池子内 token a 的 余额 现在 a 为 doge b 为其他代笔
          balanceB: 10000, // 当前交易后 池子内 tokenb 的 余额 现在 a 为 doge b 为其他代笔
          old_balance_a: 1000, // 该交易发生前 的池子 doge 余额
          old_balance_b: 10000, // 该交易发生前 的池子 doge 余额
          inTokenA: 0, // 这比交易输入的 token a 的数量 （doge数量）如果 intokena 等于0 intokenb > 0  表示 b 换 a 反之表示 a 换 b
          inTokenB: 12, // 这比交易输入的 token b 的数量  (dogi)
          outTokenA: 13, // 这比交易获得的 token a 的数量 （doge数量）
          outTokenB: 14, // 这比交易获得的 token b 的数量  (dogi)
        }],
      }
    },
  }
] as MockMethod[]
