import { MockMethod, MockConfig } from 'vite-plugin-mock'
export default [
  {
    url: '/api/sword/queryPools',
    method: 'get',
    response() {
      return {
        data: [
          {
            poolid: 1,
            tokenA: 'doge',
            tokenB: 'dogi',
            pooladdress: 'asdasjkdoasjdiosajodi',
            status: "0" // 0 正常 1 暂停 2 停止
          },
          {
            poolid: 2,
            tokenA: 'doge',
            tokenB: 'dogim',
            pooladdress: 'asdasjkdoasjdiosajodi',
            status: "0" // 0 正常 1 暂停 2 停止
          },
        ],
      }
    },
  },
  {
    url: '/api/sword/queryPoolState',
    method: 'get',
    response(req) {
      if (req.query.poolid == 1) {
        return {
          status: 'success',
          data: {
            balanceA: 1000, // 当前池子 tokena 余额（doge余额）
            balanceB: 100000, // 当前池子 tokenb 余额
            blockno: 1000000, // 当前池子最新索引的区块
          },
        }
      } else {
        return {
          status: 'success',
          data: {
            balanceA: 100, // 当前池子 tokena 余额（doge余额）
            balanceB: 1000, // 当前池子 tokenb 余额
            blockno: 1000000, // 当前池子最新索引的区块
          },
        }
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
        "status": "success",
        "data": {
            "list": [
                {
                    "status": "0",
                    "gas": 0.1,
                    "id": 849,
                    "txid": "9977291a51e74a12c927716e16ae032e54a9bc29c8a686f97f70eedb26edbc29",
                    "blockno": 4882779,
                    "balanceA": 12799.1904,
                    "balanceB": 8386248,
                    "inTokenA": 0,
                    "inTokenB": 100000,
                    "outTokenA": 146.25,
                    "outTokenB": 0,
                    "address": "D87bja59JXxmWRGJzfJxBLREgPTQxfib1e",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "7727e8344461966602633531b4f2eeef61d9835a6c75b7d57beb9fcb6d2053e5"
                },
                {
                    "status": "0",
                    "gas": 0.3,
                    "id": 848,
                    "txid": "959aed89eb515b2726cb154ea7e449a41b1420061b9384a6881e84c3c1e22bb5",
                    "blockno": 4882663,
                    "balanceA": 12789.4904,
                    "balanceB": 8392412,
                    "inTokenA": 10,
                    "inTokenB": 0,
                    "outTokenA": 0,
                    "outTokenB": 6164,
                    "address": "DLfb5UDM1oVzKHzK1dB1AbuLWxm6EM3B2d",
                    "swapType": "SWAP_A_B",
                    "processedTxid": "1a50f6131f8b2f2ae42fb635799ca47153cf6f1d1fa26bef47cc2986e16193f6"
                },
                {
                    "status": "0",
                    "gas": 0.3,
                    "id": 847,
                    "txid": "86b503fe8e77517d1ef53f1247d3ccc36a6904e7f3da8cc3fd9fde446652eb2b",
                    "blockno": 4882609,
                    "balanceA": 12689.7904,
                    "balanceB": 8456365,
                    "inTokenA": 100,
                    "inTokenB": 0,
                    "outTokenA": 0,
                    "outTokenB": 63953,
                    "address": "DGqtfRXotLDAuhue9qYm1ccavoQNeNDPBK",
                    "swapType": "SWAP_A_B",
                    "processedTxid": "863333fd018d679a1a1112bb16de8245f0948b87fe5889993de59e0adcf675f7"
                },
                {
                    "status": "0",
                    "gas": 0.3,
                    "id": 846,
                    "txid": "45ed50f116418d4dbdf14c2a581df14255756cce6d029c5608d3bf4f3e23c506",
                    "blockno": 4882453,
                    "balanceA": 12490.0904,
                    "balanceB": 8587509,
                    "inTokenA": 200,
                    "inTokenB": 0,
                    "outTokenA": 0,
                    "outTokenB": 131144,
                    "address": "D5KTDbFjsJGPu2FZxXaxAk3L6k62yaP6Fb",
                    "swapType": "SWAP_A_B",
                    "processedTxid": "f2027273c91ba34b73768552126864381879838a48af53c3194f7a04506b10fe"
                },
                {
                    "status": "1",
                    "gas": 0.3,
                    "id": 845,
                    "txid": "f3a9af2071737dd8be29b1542f9b4df59a17ee6d6f0b6f1dd2e6278eea02c336",
                    "blockno": 4882107,
                    "balanceA": 12481.3904,
                    "balanceB": 8593309,
                    "inTokenA": 9,
                    "inTokenB": 0,
                    "outTokenA": 0,
                    "outTokenB": 5800,
                    "address": "DQ6u1F1eVzDFuokRJN4v18yGNRcrwtSjEa",
                    "swapType": "SWAP_A_B",
                    "processedTxid": "8fa602a6cc6359c1008d3e934e2fa2c28e4d8b91144e639241aabddd659a62c4"
                },
                {
                    "status": "1",
                    "gas": 0.3,
                    "id": 844,
                    "txid": "7adc019b18d26ede44036e05726b48841d84b46f5705064ce5bca97b53d7aa45",
                    "blockno": 4882076,
                    "balanceA": 12181.6904,
                    "balanceB": 8798377,
                    "inTokenA": 300,
                    "inTokenB": 0,
                    "outTokenA": 0,
                    "outTokenB": 205068,
                    "address": "D8BHp1kV4a8FhNoBGqef7xB5PeuFNJFXjS",
                    "swapType": "SWAP_A_B",
                    "processedTxid": "de7b28b908a23ed09df0a3826b6e3e9d41362dab36bba77e2fff1995acd4df40"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 843,
                    "txid": "222fecbaf57f078c3769aed1af13e46a9f371946894e6bf79306101e3ae93002",
                    "blockno": 4882043,
                    "balanceA": 12598.8104,
                    "balanceB": 8498377,
                    "inTokenA": 0,
                    "inTokenB": 300000,
                    "outTokenA": 417.02,
                    "outTokenB": 0,
                    "address": "D87bja59JXxmWRGJzfJxBLREgPTQxfib1e",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "9c542fc793ff5c52660144778599f38187f477238b3e7c1ab8e5cb78f3bd2716"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 842,
                    "txid": "1ed553bd4d83d8ec3695d6bcfe947352c7e9e880dc451165952b4f679a12abc3",
                    "blockno": 4882021,
                    "balanceA": 12893.3504,
                    "balanceB": 8298377,
                    "inTokenA": 0,
                    "inTokenB": 200000,
                    "outTokenA": 294.44,
                    "outTokenB": 0,
                    "address": "D87bja59JXxmWRGJzfJxBLREgPTQxfib1e",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "03f2932a5247609673ce0b75137a39657c0b9c8f8ba2d303955426573d2ace02"
                },
                {
                    "status": "1",
                    "gas": 0.3,
                    "id": 841,
                    "txid": "4e2723eb3df9212a360c5841534d5dee3eb5eeb3e1178384c39854fe93c199b4",
                    "blockno": 4881976,
                    "balanceA": 12593.6504,
                    "balanceB": 8489929,
                    "inTokenA": 300,
                    "inTokenB": 0,
                    "outTokenA": 0,
                    "outTokenB": 191552,
                    "address": "D6urEqwbcE4F8bhV5xDqQKFs4Q6WJZTgWg",
                    "swapType": "SWAP_A_B",
                    "processedTxid": "400a93ca8e7bacce41d0786f8384092363a459b74b2753920de60fc9121aa847"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 840,
                    "txid": "225d79c24a2f1c26cd4e9416f26b88e01a49919c766c84c0ee75f9af0259b155",
                    "blockno": 4881950,
                    "balanceA": 12888.3704,
                    "balanceB": 8289929,
                    "inTokenA": 0,
                    "inTokenB": 200000,
                    "outTokenA": 294.62,
                    "outTokenB": 0,
                    "address": "D87bja59JXxmWRGJzfJxBLREgPTQxfib1e",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "421aaaa10cb0a78af12eace5a3c70174085e61c8f32ff35e658548448b9f2506"
                },
                {
                    "status": "1",
                    "gas": 0.3,
                    "id": 839,
                    "txid": "737ae90c48df611100fd4c4b16d6391385c9de3ae398725d487e071d83383376",
                    "blockno": 4881938,
                    "balanceA": 12588.6704,
                    "balanceB": 8481362,
                    "inTokenA": 300,
                    "inTokenB": 0,
                    "outTokenA": 0,
                    "outTokenB": 191433,
                    "address": "D6urEqwbcE4F8bhV5xDqQKFs4Q6WJZTgWg",
                    "swapType": "SWAP_A_B",
                    "processedTxid": "1f24ccbc8fd1748989a2c97e395e92eb44c030387035f57159739766367e177d"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 838,
                    "txid": "55e7a46baf61ac3b366da871dd919845b6c529fedc19597d061f09aca4653a14",
                    "blockno": 4881923,
                    "balanceA": 12883.5704,
                    "balanceB": 8281362,
                    "inTokenA": 0,
                    "inTokenB": 200000,
                    "outTokenA": 294.8,
                    "outTokenB": 0,
                    "address": "DFywKtdDtwyvqZrMDhNhMnDq7NWkWxhbK4",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "f92579098a3fa19d1110a126b40137f4e2e21e098bec9cd6aa1f93dd4ab35300"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 837,
                    "txid": "868a489798f20af7108268da7a073c34c769c3967a8a9a1c338c80ba33e24048",
                    "blockno": 4881870,
                    "balanceA": 13468.0304,
                    "balanceB": 7911362,
                    "inTokenA": 0,
                    "inTokenB": 370000,
                    "outTokenA": 584.36,
                    "outTokenB": 0,
                    "address": "D8Rxfe5w8TeBpjXi3eA4Lhkmdu7UgQuEZP",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "a033a2ab63ac9bad1d2116cf8ef79a9299d7298489217c248103d9f881134d77"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 836,
                    "txid": "5fc99cf0deae48da4fb700c6724e3854a0921da18c956e48a0c9efc3e3372fdd",
                    "blockno": 4881863,
                    "balanceA": 13635.2704,
                    "balanceB": 7811362,
                    "inTokenA": 0,
                    "inTokenB": 100000,
                    "outTokenA": 167.14,
                    "outTokenB": 0,
                    "address": "DPrWrozsN8yfWFRyPuPLdJsN7aKRhCRcQL",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "4452a88da658d6da4d5e429420aac1fe2f8b4e8827a4ec1d5d201a79293db751"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 835,
                    "txid": "9fdb85a16a1d3eb46d543a607906d1fde1281f2ebc6700af67628b3a20ed491e",
                    "blockno": 4881857,
                    "balanceA": 13982.8104,
                    "balanceB": 7611362,
                    "inTokenA": 0,
                    "inTokenB": 200000,
                    "outTokenA": 347.44,
                    "outTokenB": 0,
                    "address": "DFFovMRtgvWirMfWzSqvUXjQM3NCHzeyrK",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "d32d05ed819d0806e0838629556e830ce8eb264c2fa727008a227f45a7bdc13a"
                },
                {
                    "status": "5",
                    "gas": 0,
                    "id": 834,
                    "txid": "d96037fcacdbc66cd613f97417b8524673d2a271733ce72b89800cd07eb76f0c",
                    "blockno": 4881854,
                    "balanceA": 13982.8104,
                    "balanceB": 7611362,
                    "inTokenA": 0,
                    "inTokenB": 0,
                    "outTokenA": 0,
                    "outTokenB": 0,
                    "address": "DHAZ4FFFhjjDZw5CfhNtv6qVHDXsHy5vj3",
                    "swapType": "DUST",
                    "processedTxid": null
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 833,
                    "txid": "58631cb6f56967bd233aef0f1aa16f2736f2817760aaf13ae7182c63772f0e9c",
                    "blockno": 4881847,
                    "balanceA": 14274.0504,
                    "balanceB": 7451362,
                    "inTokenA": 0,
                    "inTokenB": 160000,
                    "outTokenA": 291.14,
                    "outTokenB": 0,
                    "address": "DQ6u1F1eVzDFuokRJN4v18yGNRcrwtSjEa",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "9541b1c1d91fcff006be3612dd1290a48fe6d72be401fa194f69ac1d856a9788"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 832,
                    "txid": "00de04e343a83528132274511c0ec6413bb15c23cc97745bb84db0af21ce81dd",
                    "blockno": 4881847,
                    "balanceA": 15269.9604,
                    "balanceB": 6951362,
                    "inTokenA": 0,
                    "inTokenB": 500000,
                    "outTokenA": 995.81,
                    "outTokenB": 0,
                    "address": "DKBTVerA9gd6mwetNRFN9SAdgfEdtPLSZ6",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "d11135acbbcd66d70d3c549331d7f7a354d7daf06409b65262bf95b457d00129"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 831,
                    "txid": "5c08966c90d60c43146f3acf81c46ed742af25f8db07c18bf1b9a821c0b73e9e",
                    "blockno": 4881847,
                    "balanceA": 16174.3104,
                    "balanceB": 6551362,
                    "inTokenA": 0,
                    "inTokenB": 400000,
                    "outTokenA": 904.25,
                    "outTokenB": 0,
                    "address": "DGjN8GCBzttUFJDNFzcyxF68YYnca9jnrk",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "fe0f5db5ae211b8a2b14a63e5ea550af8d23c50ba5dd7c551303b8dd7662f61d"
                },
                {
                    "status": "1",
                    "gas": 0.1,
                    "id": 830,
                    "txid": "f157c975d7a377c8d52c12d76ab8c3a44b673b5fb3d4f0fa7bd0cfb7369e00b2",
                    "blockno": 4881847,
                    "balanceA": 17194.5104,
                    "balanceB": 6151362,
                    "inTokenA": 0,
                    "inTokenB": 400000,
                    "outTokenA": 1020.1,
                    "outTokenB": 0,
                    "address": "DHAZ4FFFhjjDZw5CfhNtv6qVHDXsHy5vj3",
                    "swapType": "SWAP_B_A",
                    "processedTxid": "f031ad9cc31c627af64aa013f9ba7d4e4c20add9a47e6785ba1e2210bb934a52"
                }
            ],
            "total": 20
        }
    }
    },
  }
] as MockMethod[]
