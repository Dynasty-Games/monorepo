
const baseApiURL = 'https://api.coingecko.com/api/v3/'

const HITTED_RATE_LIMIT = 429

export default async (vsCurrency = 'usd', limit = '250', pages = '25', order = 'market_cap_desc') => {  
  let items = []
  try {
    let items = []
    for (let i = 1; i <= Number(pages); i++) {
      const query = `?vs_currency=${vsCurrency}&order=${order}&per_page=${limit}&page=${i}&sparkline=false`
      const url = `${baseApiURL}coins/markets${query}`
      const response = await fetch(url)
      const item = await response.json()
      console.log(item);
      if (response.status) {
        if (response.status.error_code === HITTED_RATE_LIMIT) {
          // todo handle
        }
      }
      if (Array.isArray(item)) items = [...items, ...item]
    }
    
  } catch (error) {
    console.log(error);
    throw error
  }
  return items
}
