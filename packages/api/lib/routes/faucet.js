// import cache from './../cache'
import {providers, getDefaultProvider, Contract, Wallet, utils } from 'ethers'
import Router from '@koa/router'
import FakeUSDC from './../../../abis/FakeUSDC.json'
import addresses from './../../../addresses/goerli.json'
import 'dotenv/config'
// import WebSocket from 'websocket'
const router = new Router()

const timedOut = {}

const network = providers.getNetwork('goerli')

const provider = getDefaultProvider(network, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
})

// random key for tests
const signer = new Wallet(process.env?.FAUCET_PRIVATE_KEY, provider)

const contract = new Contract(addresses.FakeUSDC, FakeUSDC, signer)

const timedOutMessage = ctx => {
  ctx.body = `${ctx.request.query.address} on timeout till ${new Date(timedOut[ctx.request.query.address] + 43200 * 1000)}`
}

router.get('/faucet', async ctx => {
  try {
    if (timedOut[ctx.request.query.address] + 43200 < Math.round(new Date().getTime() / 1000)) return timedOutMessage(ctx)
    let tx = await contract.mint(ctx.request.query.address, utils.parseUnits('100'))
    const hash = tx.hash
    await tx.wait()
    tx = await signer.sendTransaction({
      to: ctx.request.query.address,
      value: utils.parseUnits('0.01')
    })
    await tx.wait()
    // console.log(tx);
    ctx.body = JSON.stringify({
      dgc: hash,
      ether: tx.hash,
      address: addresses.FakeUSDC
    })
    // TODO: finish timeout
    timedOut[ctx.request.query.address] = Math.round(new Date().getTime() / 1000)
  } catch (e) {
    console.error(e);
  }
})

router.get('/faucet/tot', timedOutMessage)

export default router
