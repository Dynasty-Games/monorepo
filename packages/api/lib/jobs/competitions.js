import cache from './../cache.js'
import competitions from './../fetchers/competitions.js'

export default async () => {
  console.time('competitions');
  const data = await competitions()
  console.timeEnd('competitions');  
}
