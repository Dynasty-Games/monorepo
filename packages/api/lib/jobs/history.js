import cache from './../cache.js'
import { calculateFantasyPoints, calculateDifference } from './../../../lib/src/lib'

const twenfyFourHours = (24 * 60) * 60000
const twelveHours = (12 * 60) * 60000
const oneHour = 60 * 60000

const currencyJob = async (timestamp, currency) => {

  const stampsOneHoursAgo = currency.timestamps.filter(stamp => {
    return timestamp - stamp > oneHour
  })

  if (stampsOneHoursAgo.length === 0) return currency;

  const stampsTwelveHoursAgo = currency.timestamps.filter(stamp => {
    return timestamp - stamp > twelveHours
  })

  const stampsTwentyFourHoursAgo = currency.timestamps.filter(stamp => {
    return timestamp - stamp > twenfyFourHours
  })

  let points = 0

  if (stampsTwentyFourHoursAgo.length > 0) {
    const stamp = stampsTwentyFourHoursAgo[stampsTwentyFourHoursAgo.length - 1]
    let data = await storage.get(`currencies/${currency.id}/${stamp}`)
    data = JSON.parse(data.toString())
    if (data.marketCapChange24hPercentage !== undefined) {
      points = await calculateFantasyPoints({
        priceDifference: Number(data.marketCapChange24hPercentage),
        volumeDifference: Number(data.volumeChange24hPercentage),
        marketCapDifference: Number(data.rankChange24h)
      })
    }      
  }  

  if (stampsTwentyFourHoursAgo.length > 0) {
    const stamp = stampsTwentyFourHoursAgo[stampsTwentyFourHoursAgo.length - 1]
    let data = await storage.get(`currencies/${currency.id}/${stamp}`)
    data = JSON.parse(data.toString())
    currency.priceChange24h = Number(data.price) - Number(currency.price)      
    currency.volumeChange24hPercentage = calculateDifference(data.volume, currency.volume)
    currency.rankChange24hPercentage = calculateDifference(data.rank, currency.rank)      
    currency.pointsChange24hPercentage = calculateDifference(data.points, currency.points)

    currency.rankChange24h = Number(data.rank) - Number(currency.rank)
    currency.pointsChange24h = Number(data.points) - Number(points)
  }

  if (stampsTwelveHoursAgo.length > 0) {
    const stamp = stampsTwelveHoursAgo[stampsTwelveHoursAgo.length - 1]
    let data = await storage.get(`currencies/${currency.id}/${stamp}`)
    data = JSON.parse(data.toString())

    currency.priceChange12h = Number(data.price) - Number(currency.price)
    currency.priceChange12hPercentage = calculateDifference(data.price, currency.price)
    currency.volumeChange12hPercentage = calculateDifference(data.volume, currency.volume)
    currency.rankChange12hPercentage = calculateDifference(data.rank, currency.rank)
    currency.marketCapChange12hPercentage = calculateDifference(data.marketCap, currency.marketCap)
    currency.pointsChange12hPercentage = calculateDifference(data.points, currency.points)

    currency.rankChange12h = Number(data.rank) - Number(currency.rank)
    currency.pointsChange12h = Number(data.points) - Number(points)
  }

  if (stampsOneHoursAgo.length > 0) {
    const stamp = stampsOneHoursAgo[stampsOneHoursAgo.length - 1]
    let data = await storage.get(`currencies/${currency.id}/${stamp}`)
    data = JSON.parse(data.toString())

    currency.priceChange1h = Number(data.price) - Number(currency.price)
    currency.priceChange1hPercentage = calculateDifference(data.price, currency.price)
    currency.volumeChange1hPercentage = calculateDifference(data.volume, currency.volume)
    currency.rankChange1hPercentage = calculateDifference(data.rank, currency.rank)
    currency.marketCapChange1hPercentage = calculateDifference(data.marketCap, currency.marketCap)
    currency.pointsChange1hPercentage = calculateDifference(data.points, currency.points)

    currency.rankChange1h = Number(data.rank) - Number(currency.rank)
    currency.pointsChange1h = Number(data.points) - Number(points)
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