import {DynastyContest} from '@dynasty-games/addresses/goerli.json'
import contestsABI from '@dynasty-games/abis/DynastyContest-ABI.json'
import { Contract, utils } from 'ethers'
import provider from '../provider'

const queue = []

const job = async ({contract, category, style}, data) => {
  const open = await contract.isOpen()
  if (open) {
    const params = await contract.competitionParams()
    const participants = await contract.membersCount()
    const isOpen = await contract.isOpen()
    data.open.push(contract.address)
    data.params[contract.address] = {
      address: contract.address,
      style: params.style,
      category: params.category,
      closeTime: Number(params.closeTime.toString()) * 1000,
      feeDGC: utils.formatUnits(params.feeDGC, 0),
      interestPct: utils.formatUnits(params.interestPct, 0),
      portfolioSize: params.portfolioSize.toNumber(),
      participants: participants.toNumber(),
      name: params.name,
      startTime: Number(params.startTime.toNumber() * 1000).toString(),
      totalPrizeDGC: utils.formatUnits(params.totalPrizeDGC, 0),
      isOpen
    }
  }
  return data
}

const _runQueue = (contracts, data) => Promise.all(contracts.map(contract => job(contract, data)))
const runQueue = async data => {
  await _runQueue(queue.splice(0, queue.length > 12 ? 12 : queue.length), data)
  if (queue.length > 0) return runQueue(data)
}

export default async () => {
  const contract = await new Contract(DynastyContest, contestsABI, provider)
  const categoriesLength = await contract.categoriesLength()
  const stylesLength = await contract.stylesLength()
  
  for (let category = 0; category < categoriesLength; i++) {
    for (let i = 0; i < stylesLength; i++) {
      queue.push({
        contract,
        category,
        style
      })
    }  
  }

  let data = {
    addresses,
    open: [],
    params: {}
  }
  return runQueue(data)
}
