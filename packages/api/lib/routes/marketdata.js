import Router from '@koa/router'
import fetch from 'node-fetch'
import cache from './../cache.js'
import timestamps from './../timestamps.js'
import getMarketData from './../fetchers/marketdata.js'

const router = new Router();

const baseApiURL = 'https://api.coingecko.com/api/v3/'
// TODO: currencies sould just return all info except the marketdata

router.get('/currencies', async (ctx, next) => {
  const limit = ctx.query.limit ? Number(ctx.query.limit) : 250
  const pages = ctx.query.pages ? Number(ctx.query.pages) : 25
  
  let data = cache.get('marketdata')
  if (data && pages > 25) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, pages)
  if (!data) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, pages)
  
  data = data.slice(0, pages ? limit * pages : limit)

  if (ctx.query.maxMarketcap) {
    data = data.filter(currency => currency.marketCap <= Number(ctx.query.maxMarketcap))
  }
  if (ctx.query.minMarketcap) {
    data = data.filter(currency => currency.marketCap >= Number(ctx.query.minMarketcap))
  }

  if (ctx.query.minVolume) {
    data = data.filter(currency => currency.volume >= Number(ctx.query.minVolume))
  }
  
  if (ctx.query.maxVolume) {
    data = data.filter(currency => currency.volume <= Number(ctx.query.maxVolume))
  }
  
  ctx.body = JSON.stringify(data, null, '\t')
})

router.get('/marketdata', async (ctx, next) => {
  const limit = ctx.query.limit ? Number(ctx.query.limit) : 250
  let data = cache.get('marketdata')
  if (!data || data?.length === 0 ) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, ctx.query.pages)
  ctx.body = data.splice(0, limit)
})

router.get('/currency-info', async (ctx, next) => {
  let data = cache.get(`currency_${ctx.query.id}`)
  if (!data || new Date().getTime() > timestamps.get(`currency_${ctx.query.id}`) + (5 * 60000)) {
    const url = `${baseApiURL}coins/${ctx.query.id}?tickers=false&market_data=false&community_data=true&developer_data=false&sparkline=false`
    let response = await fetch(url)
    data = await response.json()
    data = {
      description: data.description.en,
      links: data.links
    }
    cache.add(`currency_${ctx.query.id}`, data)
  }
  ctx.body = data
})

router.get('/currency-icon', async (ctx, next) => {
  ctx.body = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${ctx.query.symbol.toLowerCase()}.svg`
})

export default router
