import { calculateWinnings } from "../../../lib/src/lib"
import { liveCompetitions, portfolioPoints } from "../../../utils/src/utils"
import { getCompetitionPortfolios } from "../utils"
import { getRankings } from "../utils"
export default async () => {
    let competitions = await liveCompetitions()
    competitions = await Promise.all(competitions.map(competition => getCompetitionPortfolios(competition)))
    competitions = competitions.filter(competition => competition.portfolios.length > 0)
    
    const points = await Promise.all(competitions[competitions.length - 1].portfolios.map(portfolio => portfolioPoints(`portfolio=${portfolio.items.join()}`)))
    
    const winnings = calculateWinnings(competitions[competitions.length - 1].prizePool, competitions[competitions.length - 1].members, points)
    console.log(winnings);
    console.log({competitions});
    // const portfolios = competitions.map(competition => competition.portfolios)

    // const memberPoints = await getRankings(portfolios)
    // const rankings = []
    // for (const _memberPoints of memberPoints) {
    //   let ranks = []
    //   for (const memberPoints of _memberPoints) {
    //     ranks.push({
    //       items: memberPoints.items,
    //       member: memberPoints.member,
    //       points: memberPoints.points
    //     })
    //   }
    //   rankings.push(ranks)
    // }

    // let i = 0

    // for (const ranking of rankings) {
    //   if (ranking.length > 0) {
    //     const competitionAddress = competitions[i].contract.address
    //      for (const {member} of ranking) {
    //        try {
    //          const ref = firebase.ref(firebase.database, `competitions/${competitionAddress.toLowerCase()}/${member.toLowerCase()}`)
    //          await firebase.set(ref, ranking)
    //        } catch (e) {
    //          console.error(e);
    //        }
    //      }
    //   }
    //   i++
    // }

    // const memberCount = portfolios.reduce((p, c) => {
    //   return p + c.length
    // }, 0)

    
  }