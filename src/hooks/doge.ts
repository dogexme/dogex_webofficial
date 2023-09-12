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

  async function payPool(cast: number, poolAddress: string) {
    const doge = window?.DogeApi
    if (await doge.isEnabled()) {
      const rs = await doge.useDoge(cast, poolAddress, 'swap');
      if (rs?.txid) {
        return rs?.txid
      }
    }
    throw 1
  }

  async function transferD20(inscriptionid: string, receiver: string) {
    const doge = window?.DogeApi
    if (await doge.isEnabled()) {
      const rs = await doge.transferd20(inscriptionid, receiver);
      if (rs?.txid) {
        return rs?.txid
      }
    }
    throw 1
  }

  return {
    connectDpal,
    payPool,
    transferD20
  }
}
