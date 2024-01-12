import defaultIcon from '@/assets/img/dogim.png'

export const tokensIcon: { [token: string]: string } = {
  doge: require('@/assets/img/dogecoin-logo.png'),
  dogim: require('@/assets/img/dogim.png'),
}

export function getTokenIcon(token: string) {
  return tokensIcon[token] || defaultIcon
}
