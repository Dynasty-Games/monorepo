import Router from '@koa/router'
import fetch from 'node-fetch'
import cache from './../cache.js'
import timestamps from './../timestamps.js'
import getMarketData from './../fetchers/marketdata.js'

const router = new Router();

const baseApiURL = 'https://api.coingecko.com/api/v3/'
// TODO: currencies sould just return all info except the marketdata

router.get('/currencies', async (ctx, next) => {
  const limit = ctx.query.limit ? Number(ctx.query.limit) : 100
  let data = cache.get('marketdata')
  if (data && Number(ctx.query.pages) > 2) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, ctx.query.pages)
  if (!data) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, ctx.query.pages)
  data = data.slice(0, ctx.query.pages ? limit * Number(ctx.query.pages) : limit)
  if (ctx.query.marketcap) {
    data = data.filter(currency => currency.market_cap > Number(ctx.query.marketcap))
  }
  ctx.body = data.map(({
    name, id, symbol, image, current_price, total_supply, salary,
    total_volume, market_cap_rank, circulating_supply,
    price_change_percentage_24h, roi, market_cap,
    market_cap_change_percentage_24h, max_supply
  }) => {
    return {
      name,
      symbol,
      image,
      roi,
      id,
      salary,
      marketCap: market_cap,
      marketCapChange24hPercentage: market_cap_change_percentage_24h,
      priceChange24hPercentage: price_change_percentage_24h,
      circulatingSupply: circulating_supply,
      rank: market_cap_rank,
      totalSupply: total_supply,
      volume: total_volume,
      price: current_price,
      maxSupply: max_supply
    }
  })
})

router.get('/marketdata', async (ctx, next) => {
  const limit = ctx.query.limit ? Number(ctx.query.limit) : 100
  let data = cache.get('marketdata')
  if (!data || data?.length === 0 ) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, ctx.query.pages)
  ctx.body = data.splice(0, limit)
})

router.get('/currency-info', async (ctx, next) => {
  let data = cache.get(`currency_${ctx.query.id}`)
  if (!data || new Date().getTime() > timestamps.get(`currency_${ctx.query.id}`) + (5 * 60000)) {
    const url = `${baseApiURL}coins/${ctx.query.id}?tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
    let response = await fetch(url)
    data = await response.json()
    cache.add(`currency_${ctx.query.id}`)
  }
  ctx.body = data
})

router.get('/currency-icon', async (ctx, next) => {
  ctx.body = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${ctx.query.symbol.toLowerCase()}.svg`
})

export default router