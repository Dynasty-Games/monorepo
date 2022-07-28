import {DynastyContests} from './../../../addresses/goerli.json'
import contestsABI from './../../../abis/DynastyContests.json'
import { Contract, utils } from 'ethers'
import provider from './../provider'

const contract = new Contract(DynastyContests, contestsABI, provider)
const queue = []

const job = async ({category, style, id}, data) => {
  const state = await contract.competitionState(category, style, id)
  const params = await contract.competition(category, style, id)
  const participants = await contract.totalMembers(category, style, id)
  const time = new Date().getTime()
  const isLive = time > Number(params.liveTime.toString()) * 1000 && time < Number(params.endTime.toString()) * 1000
  if (params.endTime.toString() === '0') return
  
  const competition = {
    style,
    category,
    id: params.id.toNumber(),
    closeTime: Number(params.endTime.toString()) * 1000,
    liveTime: Number(params.liveTime.toString()) * 1000,
    price: utils.formatUnits(params.price, 0),
    portfolioSize: params.portfolioSize.toNumber(),
    participants: participants.toNumber(),
    name: params.name,
    startTime: Number(params.startTime.toNumber() * 1000).toString(),
    prizePool: utils.formatUnits(params.prizePool, 0),
    state,
    isLive
  }

  if (state === 0) {
    if (isLive) {
      data.live.push(competition)
    } else {
      data.open.push(competition)
    }
    
  } else {
    data.closed.push(competition)
  }
  return data
}

const _runQueue = (competitions, data) => Promise.all(competitions.map(competition => job(competition, data)))

const runQueue = async data => {
  await _runQueue(queue.splice(0, queue.length > 12 ? 12 : queue.length), data)
  if (queue.length > 0) return runQueue(data)
}

export default async () => {
  const category = 0
  const style = 0

  const totalCompetitions = await contract.totalCompetitions(category, style)


  let data = {
    open: [],
    live: [],
    closed: []
  }

  for (let i = 0; i <= totalCompetitions; i++) { 
    queue.push({category, style, id: totalCompetitions - i})
  }
  await runQueue(data)
  return data
}
