import createCompetitionBatch from './create-competition-batch'
import closeCompetition from './close-competition-batch'
import cron from 'node-cron'
import { isOpen, getCompetitionParams, getCompetitionsToClose, hasStarted, hasEnded, getCompetitionPortfolios, getOpenCompetitions, getStartedCompetitions, getPortfolios, getMembers } from './../utils'
import { calculate } from '../../../app/src/apis/contests'
import getRankings from './rankings.js'
import closeCompetitionBatch from './close-competition-batch'
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
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 01:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 03:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 05:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 07:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 09:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 11:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 13:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 15:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 17:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 19:00:00`).getTime() / 1000),      
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 21:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 23:00:00`).getTime() / 1000)
   ]

    await createCompetitionBatch(competitions)
    console.log(`started ${competitions.length} @${date.toLocaleString()}`);
  }

  const runner = cron.schedule('00 1 * * *', job)
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
    for (const competition of competitions) {
      batch.categories.push(competition.category)
      batch.styles.push(competition.style)
      batch.ids.push(competition.id)
      const members = await getMembers(competition.category, competition.style, competition.id)      
      const portfolios = await getPortfolios(competition.category, competition.style, competition.id, members)
      let i = 0
      for (const member of members) {
        batch.addresses.push(member)
        batch.amounts.push(portfolios[i].submits * competition.price)
      }
      // const winnings = await calculateWinnings(competition)
    }
    
    await closeCompetitionBatch(batch)
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

export const calculateWinnings = async () => {
  const job = async () => {
    let competitions = getEndedCompetitions()
    competitions = await Promise.all(competitions.map(competition => getCompetitionPortfolios(competition)))
    const portfolios = competitions.map(competition => competition.portfolios)
    const memberPoints = await getRankings(portfolios)
  }
}
