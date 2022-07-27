import { dynastyContest } from '../contracts'

export default async (startTimes, duration = 43200) => { // 12hours in seconds

  const endTimes = startTimes.map(time => time + duration)
  const liveTimes = startTimes.map(time => time + (duration / 2))
  const categories = startTimes.map(() => 0)
  const styles = startTimes.map(() => 0)
  const names = startTimes.map(() => 'Lambo Maker')
  const prices = startTimes.map(() => 4)
  const portfolioSizes = startTimes.map(() => 8)
  const prizePools = startTimes.map(() => 0)
  const portfolioSubmits = startTimes.map(() => 4)

    const tx = await dynastyContest.createCompetitionBatch(
      categories,
      styles,
      names,
      prices,
      prizePools,
      portfolioSizes,
      portfolioSubmits,
      startTimes,
      liveTimes,
      endTimes
    )

    try {
      await tx.wait()
      console.log('competition created');
    } catch (e) {
      console.error(e)
      // throw e;
    }

  
}
