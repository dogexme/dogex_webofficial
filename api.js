

const swordApi = {
    queryPools: {
        params: null, // 请求参数
        response: { // 响应内容
            data: [
                {
                    poolid:"池子编号，可以部署相同的池子",
                    tokenA: "doge",
                    tokenB: "dogi",
                    pooladdress :"池子地址"
                }
            ]
        }
    },
    /**
     * 目前返回的都是以 doge 为基数的价格（返回的是最新的索引区块的价格）
     * 比如查询 "doge/dogi"  = 1000
     * 不支持 查询 dogi/doge 或者 dogi/其他非doge代币的价格
     * 前台根据此价格
     *  */
    queryPoolState: {
        method: "get",// 默认为 get
        params: {
            pari: "doge/dogi"
        }, // 请求参数
        response: { // 响应内容
            status: "success/failed",
            data: {
                balanceA: 1000, // 当前池子 tokena 余额（doge余额）
                balanceB: 100000, // 当前池子 tokenb 余额
                blockno: 1000000 // 当前池子最新索引的区块
            }
        }
    },
    queryTransaction: {
        params: {
            blockno: 123123,
            hash: "" // 本地记录的用户交易hash
        }, // 请求参数
        response: { // 响应内容
            status: "success/failed",
            data: {
                status: " 0 等待 1 成功 2 失败 3 会滚交易 4 粉尘交易",
                gas, // 当前交易消耗的 gas 费用 （doge）
                id,  // 在区块内的顺序
                balanceA, // 当前交易后 池子内 token a 的 余额 现在 a 为 doge b 为其他代笔
                balanceB, // 当前交易后 池子内 tokenb 的 余额 现在 a 为 doge b 为其他代笔
                old_balance_a, // 该交易发生前 的池子 doge 余额
                old_balance_b,  // 该交易发生前 的池子 doge 余额
                inTokenA,   // 这比交易输入的 token a 的数量 （doge数量）如果 intokena 等于0 intokenb > 0  表示 b 换 a 反之表示 a 换 b
                inTokenB,   // 这比交易输入的 token b 的数量  (dogi)
                outTokenA,  // 这比交易获得的 token a 的数量 （doge数量）
                outTokenB   // 这比交易获得的 token b 的数量  (dogi)
            }
        }
    },
    // 查询某个交易池子的所有交易数据
    queryPoolTransactionList: {
        params: {
            pair: "doge/dogi",
            pageSize: 10, // max 200
            page: 1
        }, // 请求参数
        response: { // 响应内容
            status: "success/failed",
            data: {
                status: " 0 等待 1 成功 2 失败 3 回滚交易 4 粉尘交易 ",
                gas, // 当前交易消耗的 gas 费用 （doge）
                id,  // 在区块内的顺序
                txid,
                blockno,
                balanceA, // 当前交易后 池子内 token a 的 余额 现在 a 为 doge b 为其他代笔
                balanceB, // 当前交易后 池子内 tokenb 的 余额 现在 a 为 doge b 为其他代笔
                old_balance_a, // 该交易发生前 的池子 doge 余额
                old_balance_b,  // 该交易发生前 的池子 doge 余额
                inTokenA,   // 这比交易输入的 token a 的数量 （doge数量）
                inTokenB,   // 这比交易输入的 token b 的数量  (dogi)
                outTokenA,  // 这比交易获得的 token a 的数量 （doge数量）
                outTokenB   // 这比交易获得的 token b 的数量  (dogi)
            }
        }
    }
}
