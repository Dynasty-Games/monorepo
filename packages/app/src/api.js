import { getDefaultProvider, Contract, utils, providers } from './../node_modules/ethers/dist/ethers.esm'
import erc20 from './data/abis/erc20'
import addresses from './../node_modules/@dynasty-games/addresses/goerli'
import ContestABI from './../node_modules/@dynasty-games/abis/DynastyContest-ABI.json'
import CompetitionABI from './../node_modules/@dynasty-games/abis/Competition-ABI.json'

const network = providers.getNetwork('goerli')

const provider = getDefaultProvider(network, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
})

// 0x07865c6e87b9f70255377e024ace6630c1eaa37f orig USDC GOERLI
const usdc = new Contract(addresses.USDDToken, erc20, provider)
const dynastyContest = new Contract(addresses.DynastyContest, ContestABI, provider)

const apiURL = 'dynasty-api.leofcoin.org'

globalThis.contracts = {
  usdc,
  dynastyContest
}

export const currencies = async () => {
  let response = await fetch(`https://${apiURL}/currencies?limit=250&pages=2`)
  response = await response.json()
  return response.slice(0, 300)
}

export const competitionAddresses = async () => {
  let response = await fetch(`https://${apiURL}/competitions`)
  return response.json()
}

export const competitions = async () => {
  let response = await fetch(`https://${apiURL}/competitions`)
  response = await response.json()
  return response
}

export const openCompetitions = async () => {
  let response = await fetch(`https://${apiURL}/open-competitions`)
  const date = new Date()
  response = await response.json()
  response = response.reduce((set, current) => {
    if (!set.exists[current.startTime]) {

      set.exists[current.startTime] = true
      set.items.push(current)
    }

    return set
  }, { exists: {}, items: [] })
  return response.items.filter(item => item.closeTime > date.getTime())
}

export const competitionContract = address => new Contract(address, CompetitionABI, provider)


export const competition = async (category, style, id) => {
  let response = await fetch(`https://${apiURL}/competitions?category=${category}&style=${style}&id=${id}`)
  return response.json()
}

// TODO: make account global, put connect and user in client api
/**
 * user USDC balance
 */
export const balance = async account => {
  const balance = await usdc.callStatic.balanceOf(account)
  return utils.formatUnits(balance) // TODO: real USDC has 6 decimals
}

/**
 * user DGC balance
 */
export const gameCredits = () => {

}
