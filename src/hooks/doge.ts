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

  return {
    connectDpal,
  }
}
