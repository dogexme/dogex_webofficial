export const DogeErrorCode = {
  notInstall: 100,
}

export function useDoge() {
  async function connectDpal() {
    const doge = window?.DogeApi
    if (doge) {
      if (await doge.isEnabled()) {
        const { userAddress } = await doge.userAddress()
        return userAddress
      } else {
        const { status } = await doge.enable()
        if (status === 'success') {
          const { userAddress } = await doge.userAddress()
          return userAddress
        }
      }
    } else {
      throw DogeErrorCode.notInstall
    }
  }

  async function useDoge(cost: string | number, address: string, costFor: string) {
    const doge = window?.DogeApi
    if (await doge.isEnabled()) {
      return doge.useDoge(cost, address, costFor)
    }
    throw 1
  }

  async function payPool(cast: number, poolAddress: string) {
    const rs = await useDoge(cast, poolAddress, 'swap')
    if (rs?.txid) {
      return rs?.txid
    }
    throw 1
  }

  async function transferD20(inscriptionid: string, address: string, amt = 0, tick = 'dogim', indexerType = '1', addliq = false) {
    const doge = window?.DogeApi
    if (await doge.isEnabled()) {
      const rs = await doge.transferd20(inscriptionid, address, amt, tick, indexerType, addliq)
      if (rs?.txid) {
        return rs?.txid
      }
    }
    throw 1
  }

  /**
   * 添加doge流动性
   * @param addresslist
   * @param costlist
   * @param costFor
   * @returns
   */
  async function useMultiDoge(addresslist: string[], costlist: string[], costFor: string) {
    const doge = window?.DogeApi
    if (await doge.isEnabled()) {
      const rs = await doge.useMultiDoge(addresslist, costlist, costFor)
      if (rs?.txid) {
        return rs?.txid
      }
    }
    throw 1
  }

  return {
    connectDpal,
    payPool,
    transferD20,
    useMultiDoge,
  }
}
