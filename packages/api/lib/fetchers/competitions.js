import {DynastyContestsProxy} from './../../../addresses/goerli.json'
import contestsABI from './../../../abis/DynastyContests.json'
import { Contract, utils } from 'ethers'
import provider from './../provider'
import runQueue from '../queue'

const contract = new Contract(DynastyContestsProxy, contestsABI, provider)

const job = async ({category, style, id}, data) => {
  const state = await contract.competitionState(category, style, id)
  const params = await contract.competition(category, style, id)
  const participants = await contract.totalMembers(category, style, id)
  const time = new Date().getTime()
  const liveTime = Number(params.liveTime.toString()) * 1000
  const endTime = Number(params.endTime.toString()) * 1000

  const isLive = time > liveTime && time < endTime
  if (params.endTime.toString() === '0') return
  
  const competition = {
    style,
    category,
    id: params.id.toNumber(),
    endTime,
    liveTime,
    price: utils.formatUnits(params.price, 8),
    portfolioSize: params.portfolioSize.toNumber(),
    participants: participants.toNumber(),
    extraData: params.extraData.toString().startsWidth('{') ? JSON.parse(params.extraData.toString()) : {},
    name: params.name,
    startTime: Number(params.startTime.toNumber() * 1000).toString(),
    prizePool: utils.formatUnits(params.prizePool, 8),
    state,
    isLive
  }

  if (state === 0 && endTime > time) {
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

const totalCompetitions = async ({category, style}, data) => {
  const totalCompetitions = await contract.totalCompetitions(category, style)
  data.push({
    totalCompetitions: totalCompetitions.toNumber(),
    category,
    style
  })
  return data
}

/**
 * Fetches all competitions
 * 
 * Competitions are fetched at once in a queue (max 12 each run)
 */
export default async () => {
  // todo: don't fetch last years competitions
  const categoriesLength = await contract.categoriesLength()
  const stylesLength = await contract.stylesLength()
  const categories = {}
  const styles = []
  let queue = []
  
  for (let category = 0; category < categoriesLength; category++) {
    const name = await contract.category(category)
    categories[name] = []
    for (let style = 0; style < stylesLength; style++) {      
      const hasStyle = await contract.totalCompetitions(category, style)
      if (hasStyle) {
        const _style = await contract.style(style)
        categories[name].push({
          name: _style[0],
          fee: _style[1].toNumber(),
          id: style
        })
        if (styles.indexOf(_style[0]) === -1) styles.push(_style[0])  
        queue.push({category, style})
      }
      
    }
  }

  let data = []

  await runQueue(data, queue, totalCompetitions)

  queue = []

  for (let i = 0; i < data.length; i++) {
    const totalCompetitions = data[i].totalCompetitions
    const category = data[i].category
    const style = data[i].style

    for (let id = 0; id <= totalCompetitions; id++) { 
      queue.push({category, style, id: totalCompetitions - id})
    }    
  }

  data = {
    open: [],
    live: [],
    closed: []
  }

  await runQueue(data, queue, job)
  data.categories = [categories]
  data.styles = styles
  return data
}
