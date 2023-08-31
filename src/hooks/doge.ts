export const DogeErrorCode = {
  notInstall: 100,
}

export function useDoge() {
  const doge = window?.DogeApi

  async function connectDpal() {
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

  async function payPool(cast: number, poolAddress: string) {
    if (await doge.isEnabled()) {
      const rs = await doge.useDoge(cast, poolAddress, 'swap');
      if (rs?.txid) {
        return rs?.txid
      }
    }
    throw 1
  }

  return {
    connectDpal,
    payPool
  }
}
