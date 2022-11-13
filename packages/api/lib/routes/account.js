import Router from '@koa/router'
import multiavatar from '@multiavatar/multiavatar'
import ethers from 'ethers'
import types from '../../../signer-types/types';
const router = new Router();

const domain = {
  name: 'Dynasty Games',
  version: '1',
  // chainId: 1,
  // verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

router.get('/account', async ctx => {
  let {address} = ctx.request.query
  const avatar = multiavatar(address)
  ctx.body = {avatar}
})

router.get('/account/avatar', async ctx => {
  let {address} = ctx.request.query
  ctx.body = multiavatar(address)
})

router.put('/account/portfolio', async ctx => {
  let {address, portfolio, id, style, category, signature } = ctx.request.query
  const message = {
    type: 'PortfolioEdit',
    value: portfolio.split(','),
    category: Number(category),
    style: Number(style),
    id: Number(id)
  }
  const signerAddr = await ethers.utils.verifyTypedData(domain, types['PortfolioEdit'], message, signature);

  if (signerAddr === address) {
    
  // todo: signature valid?
    await storage.put(`/portfolios/${address}/${id}`, Buffer.from(portfolio))
    ctx.response.status = 200
  } else {
    ctx.response.status = 401
  }
})

router.get('/account/portfolio', async ctx => {
  let {address, competitionId } = ctx.request.query
  const portfolio = await storage.get(`/portfolios/${address}/${competitionId}`)
  ctx.body = portfolio.toString().split(',')
})

export default router
