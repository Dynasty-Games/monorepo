import Router from '@koa/router'
import competitionABI from '@dynasty-games/abis/Competition-ABI.json'
import provider from './../provider'
import { Contract, utils } from 'ethers'
import cache from './../cache'
import competitions from './../fetchers/competitions'
import categories from './../fetchers/categories'

const router = new Router();

router.get('/competitionsByCategory', async ctx => {
  
  let data = cache.get('/categories')
  if (!data) {
    data = await categories()
    cache.add('/categories', data)
  }
  ctx.body = data[ctx.query.category]
})

/**
 * fetch('/contest?id=lambomaker')
 */
router.get('/competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.addresses
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.addresses
  }
})

router.get('/open-competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.open
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.open
  }
})

router.get('/competitions/params', async ctx => {
  const wantedAddress = ctx.query.address
  const data = cache.get('competitions')
  let cachedItems = cache.get('competition-params')

  let addresses
  if (cachedItems?.addresses?.length > 0) addresses = data.addresses.filter(address => cachedItems.addresses.indexOf(address) === -1)
  else {
    addresses = data.addresses
    cachedItems = {
      addresses: [],
      params: []
    }
  }

  const contracts = addresses.map(address => new Contract(address, competitionABI, provider))
  let params = await Promise.all(contracts.map(contract => contract.competitionParams()))
  const participants = await Promise.all(contracts.map(contract => contract.membersCount()))

  params = [...cachedItems.params, ...params.map((current, i) => ({
    address: contracts[i].address,
    participants: participants[i].toNumber(),
    category: current.category,
    feeDGC: utils.formatUnits(current.feeDGC, 0),
    interestPct: utils.formatUnits(current.interestPct, 0),
    name: current.name,
    style: current.style,
    portfolioSize: current.portfolioSize.toNumber(),
    closeTime: Number(current.closeTime.toString()) * 1000,
    startTime: Number(current.startTime.toNumber()) * 1000,
    totalPrizeDGC: utils.formatUnits(current.totalPrizeDGC, 0)
  }))]

  cache.add('competition-params', {
    addresses: [...addresses, ...cachedItems.addresses],
    params
  })

  if (wantedAddress) {
    ctx.body = params.filter(c => c.address?.toLowerCase() === wantedAddress.toLowerCase())
  } else {
    ctx.body = params
  }
})

router.get('/open-competitions/params', async ctx => {
  const wantedAddress = ctx.query.address
  const data = cache.get('competitions')

  ctx.body = wantedAddress ? data.params[wantedAddress] : Object.values(data.params)
})

export default router
