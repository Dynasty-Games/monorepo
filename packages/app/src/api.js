import { getDefaultProvider, Contract, utils, providers } from './../node_modules/ethers/dist/ethers.esm'
import erc20 from './data/abis/erc20'
import addresses from './../../addresses/goerli'
import ContestABI from './../../abis/DynastyContests.json'

const network = providers.getNetwork('goerli')

const provider = getDefaultProvider(network, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
})

// 0x07865c6e87b9f70255377e024ace6630c1eaa37f orig USDC GOERLI
const usdc = new Contract(addresses.FakeUSDC, erc20, provider)
const dynastyContest = new Contract(addresses.DynastyContests, ContestABI, provider)

const apiURL = 'api.dynastygames.games'

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

export const liveCompetitions = async () => {
  let response = await fetch(`https://${apiURL}/live-competitions`)
  response = await response.json()
  return response
}

export const openCompetitions = async () => {
  let response = await fetch(`https://${apiURL}/open-competitions`)
  response = await response.json()
  return response
}

export const closedCompetitions = async () => {
  let response = await fetch(`https://${apiURL}/closed-competitions`)
  const date = new Date()
  response = await response.json()
  return response
}

export const competition = async (category, style, id) => {
  let response = await fetch(`https://${apiURL}/competitions?category=${category}&style=${style}&id=${id}`)
  const params = await response.json()
  return params[0]
}

// TODO: make account global, put connect and user in client api
/**
 * user USDC balance
 */
export const balance = async account => {
  const balance = await usdc.callStatic.balanceOf(account)
  return utils.formatUnits(balance, 8) // TODO: real USDC has 6 decimals
}

/**
 * user DGC balance
 */
export const gameCredits = () => {
  return contracts.dynastyContest.balanceOf(connector.accounts[0], 0)
}

export const signMessage = (type, category, style, id, value) => {
  let message = {
    type,
    value
  }
  if (type === 'editPortfolio') {    
    message = {
      ...message,
      category,
      style,
      id,
    }
  }
  const data = JSON.stringify(message).toString('hex')
  const bytes = _ethers.utils.arrayify(data)
  return connector.signMessage(bytes)
}


export const editPortfolio = async ({category, style, id, portfolio}) => {
  fetch()
}