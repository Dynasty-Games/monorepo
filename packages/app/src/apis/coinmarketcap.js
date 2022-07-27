export const currencies = async () => {
  let response = await fetch('https://dynasty-api.leofcoin.org/currencies?limit=250&pages=2')
  response = await response.json()
  return response.slice(0, 300)
}

export default {
  currencies,
  icon: async symbol => {
    let response = await fetch(`https://dynasty-api.leofcoin.org/currency-icon?symbol=${symbol}`)

    response = await response.json()
    return response
  },
  currency: async id => {
    let response = await fetch(`https://dynasty-api.leofcoin.org/currency-info?id=${id}`)

    response = await response.json()
    return response
  }
}
