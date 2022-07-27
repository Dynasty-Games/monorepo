import getMarketData from './../fetchers/marketdata.js'
import cache from './../cache.js'

export default async () => {
  let data = await getMarketData('usd', '150', '2')
  data = data.map(currency => {
    currency.marketCap = currency.market_cap
    return currency
  })
  cache.add('_marketdata', data)
}
