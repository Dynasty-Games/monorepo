import fetch from 'node-fetch'

const baseApiURL = 'https://api.coingecko.com/api/v3/'

export default async (vsCurrency = 'usd', limit = '250', pages = '1', order = 'market_cap_desc') => {
  let items = []
  for (let i = 1; i <= Number(pages); i++) {
    const query = `?vs_currency=${vsCurrency}&order=${order}&per_page=${limit}&page=${i}&sparkline=false`
    const url = `${baseApiURL}coins/markets${query}`
    const response = await fetch(url)
    const item = await response.json()
    items = [...items, ...item]
  }
  return items
}
