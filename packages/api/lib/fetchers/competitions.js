import {DynastyContestsProxy} from './../../../addresses/goerli.json'
import contestsABI from './../../../abis/DynastyContests.json'
import { Contract, utils } from 'ethers'
import provider from './../provider'
import runQueue from '../queue'

const contract = new Contract(DynastyContestsProxy, contestsABI, provider)

const competitionInfo = async ({category, style, id}, data) => {
  try {
    const params = await contract.competition(category, style, id)
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
      participants: params.members.length,
      extraData: params.extraData !== '0x' ? JSON.parse(Buffer.from(params.extraData.replace('0x', ''), 'hex').toString()) : {},
      name: params.name,
      startTime: Number(params.startTime.toNumber() * 1000).toString(),
      prizePool: utils.formatUnits(params.prizePool, 8),      
      members: params.members,
      state: params.state,
      isLive
    }

    if (params.state === 0 && endTime > time) {
      if (isLive) {
        data.liveNames.indexOf(params.name) === -1 && data.liveNames.push(params.name)
        data.live.push(competition)
      } else {        
        data.openNames.indexOf(params.name) === -1 && data.openNames.push(params.name)
        data.open.push(competition)
      }

    } else {
      data.closed.push(competition)
    }

    data.names.indexOf(params.name) === -1 && data.names.push(params.name)
  } catch (e) {
    console.warn(style, category, id);
    console.trace(e)
  }
  return data
}

const totalCompetitions = async ({category, style, name, totalCompetitions}, data) => {  
  if (!data.categories[name]) data.categories[name] = []
  const _style = await contract.style(style)
  data.categories[name].push({
    name: _style[0],
    fee: _style[1].toNumber(),
    id: style
  })
  
  if (data.styles.indexOf(_style[0]) === -1) data.styles.push(_style[0])

  data.items.push({
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
  
  let queue = []

  let data = {
    categories: {},
    styles: [],
    items: []
  }
  
  for (let category = 0; category < categoriesLength; category++) {
    const name = await contract.category(category)
    for (let style = 0; style < stylesLength; style++) {    
      try {
        const totalCompetitions = await contract.totalCompetitions(category, style)  
        queue.push({category, style, name, totalCompetitions})
      } catch {

      }      
    }  
  }
  await runQueue(data, queue, totalCompetitions)

  queue = []

  for (let i = 0; i < data.items.length; i++) {
    const totalCompetitions = data.items[i].totalCompetitions
    const category = data.items[i].category
    const style = data.items[i].style

    for (let id = 0; id <= totalCompetitions; id++) {
      queue.push({category, style, id})
    }
  }

  const categories = data.categories
  const styles = data.styles

  data = {
    open: [],
    live: [],
    closed: [],
    names: [],
    openNames: [],
    liveNames: []
  }

  await runQueue(data, queue, competitionInfo)
  data.categories = [categories]
  data.styles = styles
  return data
}
