import { dynastyContest } from '../contracts'

export default async (startTimes, duration = 43200) => { // 12hours in seconds

  const endTimes = startTimes.map(time => time + duration)

  for (let i = 0; i < startTimes.length; i++) {
    const tx = await dynastyContest.createCompetition(
      'Lambo Maker', // name
      0, // category
      0, // style
      4, // fee
      100, // prize
      15, // interestPCT
      8, // portfolioSize
      3, // edits
      startTimes[i],
      endTimes[i]
    )

    try {
      await tx.wait()
      console.log('competition created');
    } catch (e) {
      console.error(e)
      // throw e;
    }
  }

  
}
