

export const apiURL = 'https://api.dynastygames.games/'
let _fetch
const fetch = async (method, query, options, type) => {
  if (!globalThis.fetch) {
    _fetch = await import('node-fetch')
    _fetch = _fetch.default
  }
  const url = `${apiURL}${method}${query ? `?${query}` : ''}`
  const response = globalThis.fetch ? await globalThis.fetch(url, options) : await _fetch(url, options)
  if (type) {
    return response[type]()
  }
  return response.json()
}

const fetchText = (method, query, options) => fetch(method, query, options, 'text')

export const currencies = query => fetch('currencies', query)

export const openCompetitions = query => fetch('open-competitions', query)

export const openCompetitionNames = query => fetch('open-competition-names', query)

export const liveCompetitionNames = query => fetch('live-competition-names', query)

export const competitionNames = query => fetch('competition-names', query)

export const liveCompetitions = query => fetch('live-competitions', query)

export const closedCompetitions = query => fetch('closed-competitions', query)

export const styles = query => fetch('styles', query)

export const categories = query => fetch('categories', query)

export const portfolioPoints = query => fetch('portfolio-points', query)

export const avatar = query => fetchText('account/avatar', query)

export const account = query => fetch('account', query)

export const accountPortfolio = query => fetch('account/portfolio', query)

export const accountPortfolioSave = query => fetch('account/portfolio', query, {method: 'put'})