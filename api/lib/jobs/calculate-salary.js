import cache from './../cache.js'
import { calculateBaseSalary } from '@dynasty-games/lib'

export default async () => {
  let data = cache.get('_marketdata')
  data = calculateBaseSalary(data.slice(0, 300))
  cache.add('marketdata', data)
}
