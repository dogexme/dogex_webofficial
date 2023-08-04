export function setCollectionLogo(collection: any) {
  const nfts = JSON.parse(localStorage.getItem('nfts')!)
  const txs = nfts.txs

  console.log(txs)

  function merge(c: { txid: string }, txid: string) {
    return Object.assign({}, c, txs[txid] ?? {})
  }

  return Array.isArray(collection) ? collection.map((c) => merge(c, c.txid)) : merge(collection, collection.txid)
}

export function omitCenterString(str?: string, minLen = 12, omitStr = '...') {
  if (!str) return ''
  const strLen = str.length
  let i = 0

  if (strLen < minLen) {
    return str
  } else {
    i = Math.floor(minLen / 2)
  }

  return str.slice(0, i) + omitStr + str.slice(strLen - i)
}

export function dateFormat(date: Date) {
  const yy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  const hh = date.getHours()
  const mf = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
}

export function numberFormat(number = 0) {
  return !(number + '').includes('.')
    ? // 就是说1-3位后面一定要匹配3位
      (number + '').replace(/\d{1,3}(?=(\d{3})+$)/g, (match) => {
        return match + ','
      })
    : (number + '').replace(/\d{1,3}(?=(\d{3})+(\.))/g, (match) => {
        return match + ','
      })
}
