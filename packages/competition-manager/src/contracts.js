import addresses from './../../addresses/goerli.json'
import { getDefaultProvider, Contract, utils, providers, Wallet } from 'ethers'
import ContestABI from './../../abis/DynastyContests.json'

import secureEnv from 'secure-env'

const args = process.argv
let secret

for (const arg of args) {
  if (arg === '--secret') secret = args[args.indexOf(arg) + 1]
}

export const config = secureEnv({secret})

export const network = providers.getNetwork('goerli')

export const provider = getDefaultProvider(network, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
})

export const wallet = new Wallet(config.goerli_PRIVATE_KEY, provider)

export const dynastyContest = new Contract(addresses.DynastyContests, ContestABI, wallet)
