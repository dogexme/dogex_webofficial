type CollectionParam<T> = (T & { txid: string }) | (T & { txid: string }[])

export function setCollectionLogo<T>(collection: CollectionParam<T>) {
  const nfts = JSON.parse(localStorage.getItem('nfts')!)
  const txs = nfts.txs

  function merge(c: { txid: string }, txid: string) {
    return Object.assign({}, c, txs[txid] ?? {})
  }

  return Array.isArray(collection) ? collection.map((c) => merge(c, c.txid)) : merge(collection, collection.txid)
}

export function omitCenterString(str: string, minLen = 12, omitStr = '...') {
  const strLen = str.length
  let i = 0

  if (strLen < minLen) {
    return str
  } else {
    i = Math.floor(minLen / 2)
  }

  return str.slice(0, i) + omitStr + str.slice(strLen - i)
}
