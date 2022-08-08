

export const apiURL = 'https://api.dynastygames.games/'
let _fetch
const fetch = async (method, query) => {
  if (!globalThis.fetch) {
    _fetch = await import('node-fetch')
    _fetch = _fetch.default
  }
  const url = `${apiURL}${method}${query ? `?${query}` : ''}`
  const response = globalThis.fetch ? await globalThis.fetch(url) : await _fetch(url) 
  return response.json()
}
export const currencies = query => fetch('currencies', query)

export const openCompetitions = query => fetch('open-competitions', query)

export const liveCompetitions = query => fetch('live-competitions', query)

export const closedCompetitions = query => fetch('closed-competitions', query)

export const styles = query => fetch('styles', query)

export const categories = query => fetch('categories', query)