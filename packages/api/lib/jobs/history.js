import cache from './../cache.js'
import { calculateFantasyPoints, calculateDifference, difference } from './../../../lib/src/lib'

const twenfyFourHours = (24 * 60) * 60000
const twelveHours = (12 * 60) * 60000
const oneHour = 60 * 60000

const currencyJob = async (timestamp, currency) => {

  let stampsOneHoursAgo = currency.timestamps.filter(stamp => {
    return timestamp - stamp > oneHour && timestamp - stamp < oneHour * 2
  })

  stampsOneHoursAgo = stampsOneHoursAgo.sort((a, b) => b - a)

  if (stampsOneHoursAgo.length === 0) {
    delete currency.timestamps
    return currency
  }

  let stampsTwelveHoursAgo = currency.timestamps.filter(stamp => {
    const time = timestamp - stamp
    return time > twelveHours && time < twelveHours + oneHour
  })

  stampsTwelveHoursAgo = stampsTwelveHoursAgo.sort((a, b) => b - a)

  let stampsTwentyFourHoursAgo = currency.timestamps.filter(stamp => {
    const time = timestamp - stamp
    return time > twenfyFourHours && time < twenfyFourHours + oneHour
  })

  stampsTwentyFourHoursAgo = stampsTwentyFourHoursAgo.sort((a, b) => b - a)

  let points = 0

  if (stampsTwentyFourHoursAgo.length > 0) {
    const stamp = stampsTwentyFourHoursAgo[0]
    let data = await storage.get(`currencies/${currency.id}/${stamp}`)
    data = JSON.parse(data.toString())
    if (data.volumeChange24hPercentage !== undefined) {
      points = await calculateFantasyPoints({
        priceDifference: data.priceChange24hPercentage || 0,
        volumeDifference: data.volumeChange24hPercentage || 0,
        marketCapDifference: data.rankChange24h || 0
      })
    }
  }

  currency.points = points

  if (stampsTwentyFourHoursAgo.length > 0) {
    const stamp = stampsTwentyFourHoursAgo[0]
    let data = await storage.get(`currencies/${currency.id}/${stamp}`)
    data = JSON.parse(data.toString())

    currency.volumeChange24hPercentage = calculateDifference(data.volume, currency.volume)
    currency.rankChange24hPercentage = calculateDifference(data.rank, currency.rank)
    currency.rankChange24h = difference(data.rank, currency.rank)
    currency.priceChange24h = difference(data.price, currency.price)

    if (!isNaN(data.points)) {
      currency.pointsChange24hPercentage = calculateDifference(data.points, currency.points)
      currency.pointsChange24h = difference(data.points, points)
    }
  }

  if (stampsTwelveHoursAgo.length > 0) {
    const stamp = stampsTwelveHoursAgo[0]
    let data = await storage.get(`currencies/${currency.id}/${stamp}`)
    data = JSON.parse(data.toString())

    currency.priceChange12hPercentage = calculateDifference(data.price, currency.price)
    currency.volumeChange12hPercentage = calculateDifference(data.volume, currency.volume)
    currency.rankChange12hPercentage = calculateDifference(data.rank, currency.rank)
    currency.marketCapChange12hPercentage = calculateDifference(data.marketCap, currency.marketCap)

    currency.priceChange12h = difference(data.price, currency.price)
    currency.rankChange12h = difference(data.rank, currency.rank)

    if (!isNaN(data.points)) {
      currency.pointsChange12hPercentage = calculateDifference(data.points, points)
      currency.pointsChange12h = difference(data.points, points)
    }
  }

  if (stampsOneHoursAgo.length > 0) {
    const stamp = stampsOneHoursAgo[0]
    let data = await storage.get(`currencies/${currency.id}/${stamp}`)
    data = JSON.parse(data.toString())

    currency.priceChange1hPercentage = calculateDifference(data.price, currency.price)
    currency.volumeChange1hPercentage = calculateDifference(data.volume, currency.volume)
    currency.rankChange1hPercentage = calculateDifference(data.rank, currency.rank)
    currency.marketCapChange1hPercentage = calculateDifference(data.marketCap, currency.marketCap)
    currency.priceChange1h = difference(data.price, currency.price)
    currency.rankChange1h = difference(data.rank, currency.rank)

    if (!isNaN(data.points)) {
      currency.pointsChange1hPercentage = calculateDifference(data.points, points)
      currency.pointsChange1h = difference(data.points, points)
    }
  }
  
  delete currency.timestamps
  delete currency.salary

  await storage.put(`currencies/${currency.id}/${timestamp}`, Buffer.from(JSON.stringify(currency)))
  return currency
}

export const timestampJob = async currency => {
  const timestamps = await storage.readDir(`currencies/${currency.id}`)
  currency.timestamps = timestamps.map(stamp => stamp.split('.data')[0]);
  return currency
}

export default async () => {
  let currencies = cache.get('_marketdata')
  const timestamp = new Date().getTime()
  const set = {
    added: [],
    has: []
  }

  await Promise.all(currencies.map(async (currency, i) => {
    const has = await storage.hasDir(`currencies/${currency.id}`)
    if (has) set.has.push(currency)
    else set.added.push(currency)
  }))

  const stamps = await Promise.all(set.has.map(currency => timestampJob(currency)))

  currencies = await Promise.all(stamps.map(currency => currencyJob(timestamp, currency)))

  await Promise.all(set.added.map(currency => storage.put(`currencies/${currency.id}/${timestamp}`, Buffer.from(JSON.stringify(currency)))))

  cache.add('marketdata', [...currencies, ...set.added])
}
