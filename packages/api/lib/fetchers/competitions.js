import {DynastyContestsProxy} from './../../../addresses/goerli.json'
import contestsABI from './../../../abis/DynastyContests.json'
import { Contract, utils } from 'ethers'
import provider from './../provider'
import runQueue from '../queue'
import { staticCategories, staticStyles } from '../../../lib/src/lib'



const contract = new Contract(DynastyContestsProxy, contestsABI, provider)

const getSavedCompetitions = async () => {
  try {
    const saves = await storage.get('competitions/competitions')
    return saves
  } catch {
    return []
  }
  
}

const getSavedCategories = async () => {
  try {
    const saves = await storage.get('competitions/categories')
    return saves
  } catch {
    return []
  }
  
}

const getSavedStyles = async () => {
  try {
    const saves = await storage.get('competitions/styles')
    return saves
  } catch {
    return []
  }
  
}

const JSONToBuffer =(json) => {
  return Buffer.from(JSON.stringify(json))
}
/**
 * Fetches all competitions
 *
 * Competitions are fetched at once in a queue (max 12 each run)
 */
export default async () => {
  // todo: don't fetch last years competitions

  const [categories, styles, competitions] = await Promise.all([getSavedCategories, getSavedStyles, getSavedCompetitions])
  

  let data = {
    open: [],
    live: [],
    closed: [],
    names: [],
    openNames: [],
    liveNames: [],
    competitions: [],
    categories: {}
  }

  if (categories.length !== staticCategories.length) await storage.put('competitions/categories', JSONToBuffer(staticCategories))
  if (styles.length !== staticStyles.length) await storage.put('competitions/styles', JSONToBuffer(staticStyles))

    for (let category = 0; category < staticCategories.length; category++) {
      for (let style = 0; style < staticStyles.length; style++) {

        let fetchedCompetitions = await contract.competitionsByCategoryAndStyle(category, style)

        if (fetchedCompetitions.length > 0) {
          if (!data.categories[staticCategories[category].name]) data.categories[staticCategories[category].name] = []

          data.categories[staticCategories[category].name].push({
            name: staticStyles[style].name,
            fee: staticStyles[style].fee,
            id: style
          })
          await storage.put('/competitions/categories', JSONToBuffer([data.categories]))
        }

        fetchedCompetitions = fetchedCompetitions.map(competition => {

          const time = new Date().getTime()
          const liveTime = Number(competition.liveTime.toString()) * 1000
          const endTime = Number(competition.endTime.toString()) * 1000
          const isLive = time > liveTime && time < endTime
          
          if (competition.endTime.toString() === '0') return

          competition =  {
            style: style,
            category: category,
            id: competition.id.toNumber(),
            endTime,
            liveTime,
            price: utils.formatUnits(competition.price, 8),
            portfolioSize: competition.portfolioSize.toNumber(),
            participants: competition.members.length,
            extraData: competition.extraData !== '0x' ? JSON.parse(Buffer.from(competition.extraData.replace('0x', ''), 'hex').toString()) : {},
            name: competition.name,
            startTime: Number(competition.startTime.toNumber() * 1000).toString(),
            prizePool: utils.formatUnits(competition.prizePool, 8),      
            members: competition.members,
            state: competition.state,
            isLive
          }

          if (competition.state === 0 && endTime > time) {
            if (isLive) {
              data.liveNames.indexOf(competition.name) === -1 && data.liveNames.push(competition.name)
              data.live.push(competition)
            } else {        
              data.openNames.indexOf(competition.name) === -1 && data.openNames.push(competition.name)
              data.open.push(competition)
            }
          } else {
            data.closed.push(competition)
          }

          data.names.indexOf(competition.name) === -1 && data.names.push(competition.name)
    
          return competition
        })
        data.competitions = [...data.competitions, ...fetchedCompetitions]
      }
    }
  // }



  await storage.put('/competitions/open', JSONToBuffer(data.open))
  await storage.put('/competitions/closed', JSONToBuffer(data.closed))
  await storage.put('/competitions/live', JSONToBuffer(data.live))
  await storage.put('/competitions/names', JSONToBuffer(data.names))
  await storage.put('/competitions/open-names', JSONToBuffer(data.openNames))
  await storage.put('/competitions/live-names', JSONToBuffer(data.liveNames))
  await storage.put('/competitions/competitions', JSONToBuffer(data.competitions))
  return data
}
