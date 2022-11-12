import createCompetitionBatch from './create-competition-batch'
import cron from 'node-cron'
import { isOpen, getCompetitionParams, getCompetitionsToClose, hasStarted, hasEnded, getCompetitionPortfolios, getOpenCompetitions, getStartedCompetitions, getPortfolios, getMembers } from './../utils'
import { calculate } from '../../../app/src/apis/contests'
import getRankings from './rankings.js'
import closeCompetition from './close-competition'
import { BigNumber, utils } from 'ethers'
import { isOdd } from './../utils'
import { DynastyTreasury } from './../../../addresses/goerli.json'
import { calculateBaseWinnings, calculateWinnings } from '../../../lib/src/lib'
import { portfolioPoints } from '../../../utils/src/utils'
/**
 * runs everyday at 15:00
 * creates all competitions from same day 17:00 to day after 15:00
 */
export const create = () => {
  console.log(`create: starting scheduler`);
  const job = async () => {
    const date = new Date()
    let nextDay = new Date(date.getTime())
    nextDay.setDate(date.getDate() + 1);

    const competitions = [
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 11:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 23:00:00`).getTime() / 1000)
   ]

    await createCompetitionBatch(competitions, 'Lambo Maker', Buffer.from(JSON.stringify({
      salary: {
        max: 9000,
        min: 1000
      },
      maxSalary: 50000,
      query: {      
        items: 300
      }
    })))
    
    await createCompetitionBatch(competitions, 'Rekt To Riches', Buffer.from(JSON.stringify({
      salary: {
        max: 18000,
        min: 1000
      },
      maxSalary: 50000,      
      query: {      
        maxMarketcap: 80000000, 
        volume: 200000
      }
    })))

    await createCompetitionBatch(competitions, 'Blind Ape', Buffer.from(JSON.stringify({
      salary: {
        max: 18000,
        min: 1000
      },
      maxSalary: 50000,
      query: {      
        maxMarketcap: 80000000, 
        volume: 200000
      }
    })))

    console.log(`started ${competitions.length} @${date.toLocaleString()}`);
  }

  const runner = cron.schedule('00 23 * * *', job)
  return { runner, job }
}

/**
 * runs every two hours at 1min after on odd hours
 */
export const close = () => {
  console.log(`close: starting scheduler`);
  const job = async () => {
    const competitions = await getCompetitionsToClose()
    const batch = {
      categories: [],
      styles: [],
      ids: [],
      amounts: [],
      addresses: [],
      tokenId: 0
    }
    let i = 0
    for (const competition of competitions) {
      const members = await getMembers(competition.category, competition.style, competition.id)
      const portfolios = await getPortfolios(competition.category, competition.style, competition.id, members)
      const points = await Promise.all(portfolios.map(portfolio => portfolioPoints(`portfolio=${portfolio.items.join()}`)))
      
      batch.categories.push(competition.category)
      batch.styles.push(competition.style)
      batch.ids.push(competition.id)


      // const matches = members.reduce((set, p) => {
      //   if (!set[portfolios[i].submits]) set[portfolios[i].submits] = 0
      //   if (isOdd(set[portfolios[i].submits])) {
      //     set[portfolios[i].submits - 1] += 1
      //   } else {
      //     set[portfolios[i].submits] += 1
      //   }
      //   i++
      //   return set
      // }, {})
      batch.addresses[i] = []
      batch.amounts[i] = []
      
      const winnings = await calculateWinnings(competition.prizePool, members, points)
      batch.addresses[i] = winnings.members
      batch.amounts[i] = winnings.amounts.map(amount => utils.parseUnits(amount.toString(), 8))
    
      i++
      // const winnings = await calculateWinnings(competition)
    }
    batch.tokenId = 0
    console.log(batch);
    for (let i = 0; i < batch.categories.length; i++) {
      await closeCompetition(batch.categories[i], batch.styles[i], batch.ids[i], batch.amounts[i], batch.addresses[i])
    }
    
    console.log(`closed ${competitions.length} @${new Date().toLocaleString()}`);
  }
  const runner = cron.schedule('5 1,3,5,7,9,11,13,15,17,19,21,23 * * *', job)
  return { runner, job }
}


/**
 * runs every minute
 */
export const rankings = () => {
  console.log(`rankings: starting scheduler`);
  const job = async () => {
    await getRankings()
    // console.log(`rankings updated for ${competitions.length} competitions & ${memberCount} members @${new Date().toLocaleString()}`);
  }
  const runner = cron.schedule('*/1 * * * *', job)
  return { runner, job }
}

// export const calculateWinnings = async () => {
//   const job = async () => {
//     let competitions = getEndedCompetitions()
//     competitions = await Promise.all(competitions.map(competition => getCompetitionPortfolios(competition)))
//     const portfolios = competitions.map(competition => competition.portfolios)
//     const memberPoints = await getRankings(portfolios)
//   }
// }
