export function useDoge() {
  const doge = window?.DogeApi
  const address = ref('')
  const isInstall = ref(false)

  async function connectDpal() {
    if (doge) {
      if (await doge.isEnabled()) {
        const { userAddress } = await doge.userAddress()
        address.value = userAddress
      } else {
        const { status } = await doge.enable()
        if (status === 'success') {
          const { userAddress } = await doge.userAddress()
          address.value = userAddress
        }
      }
      isInstall.value = true
    } else {
      console.log(`please install dpal wallet`)
      isInstall.value = false
    }
  }

  return {
    doge,
    address,
    connectDpal,
    isInstall,
  }
}
