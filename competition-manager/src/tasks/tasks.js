import createCompetitionBatch from './create-competition-batch'
import closeCompetition from './close-competition'
import {competitionAddresses, getCompetitionContract} from './../contracts'
import cron from 'node-cron'
import { isOpen, getRankings, getCompetitionParams, getCompetitionsToClose, hasStarted, hasEnded, getCompetitionPortfolios, getOpenCompetitions, getStartedCompetitions } from './../utils'

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
      Math.round(new Date(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 17:45:00`).getTime() / 1000), 
      Math.round(new Date(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 19:00:00`).getTime() / 1000),
      Math.round(new Date(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 21:00:00`).getTime() / 1000),
      Math.round(new Date(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} 23:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 01:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 03:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 05:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 07:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 09:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 11:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 13:00:00`).getTime() / 1000),
      Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 15:00:00`).getTime() / 1000)
   ]

    await createCompetitionBatch(competitions)
    console.log(`started ${competitions.length} @${date.toLocaleString()}`);
  }

  const runner = cron.schedule('00 15 * * *', job)
  return { runner, job }
}

/**
 * runs every two hours at 1min after on odd hours
 */
export const close = () => {
  console.log(`close: starting scheduler`);
  const job = async () => {
    const competitions = await getCompetitionsToClose()

    for (const competition of competitions) {
      await closeCompetition(competition)
    }
    console.log(`closed ${competitions.length} @${new Date().toLocaleString()}`);
  }
  const runner = cron.schedule('5 1,3,5,7,9,11,13,15,17,19,21,23 * * *', job)
  return { runner, job }
}


/**
 * runs every 5 minutes
 */
export const rankings = () => {
  console.log(`rankings: starting scheduler`);
  const job = async () => {
    let competitions = await getStartedCompetitions()
    competitions = await Promise.all(competitions.map(competition => getCompetitionPortfolios(competition)))
    competitions = competitions.filter(competition => competition.portfolios.length > 0)
    const portfolios = competitions.map(competition => competition.portfolios)

    const memberPoints = await getRankings(portfolios)
    const rankings = []
    for (const _memberPoints of memberPoints) {
      let ranks = []
      for (const memberPoints of _memberPoints) {
        ranks.push({
          items: memberPoints.items,
          member: memberPoints.member.toLowerCase(),
          points: memberPoints.points
        })
      }
      rankings.push(ranks)
    }

    let i = 0

    for (const ranking of rankings) {
      if (ranking.length > 0) {
        const competitionAddress = competitions[i].contract.address
         for (const {member} of ranking) {
           try {
             const ref = firebase.ref(firebase.database, `competitions/${competitionAddress.toLowerCase()}/${member.toLowerCase()}`)
             await firebase.set(ref, ranking)
           } catch (e) {
             console.error(e);
           }
         }
      }
      i++
    }

    const memberCount = portfolios.reduce((p, c) => {
      return p + c.length
    }, 0)

    console.log(`rankings updated for ${competitions.length} competitions & ${memberCount} members @${new Date().toLocaleString()}`);
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
