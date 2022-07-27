export const calculate = async (id) => {
  let response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`)
  response = await response.json()

  console.log(response)
}
