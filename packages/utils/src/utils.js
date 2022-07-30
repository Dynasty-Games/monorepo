import _fetch from 'node-fetch'

export const apiURL = 'https://dynasty-api.leofcoin.org/'

const fetch = async (method, query) => {
  const response = await _fetch(`${apiURL}${method}${query ? `?${query}` : ''}`)
  return response.json()
}

export const openCompetitions = query => fetch('open-competitions', query)

export const liveCompetitions = query => fetch('live-competitions', query)

export const closedCompetitions = query => fetch('closed-competitions', query)
