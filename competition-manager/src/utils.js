import fetch from 'node-fetch'
import { calculateFantasyPoints } from '@dynasty-games/lib'
import {writeFileSync} from 'fs'

export const isOdd = number => {
  return Math.abs(number % 2) === 1
}

export const isOpen = async competition => {
  try {
    competition.isOpen = await competition.contract.isOpen()
  } catch (e) {
    console.error(e)
  }
  return competition
}

export const getCompetitionParams = async competition => {
  try {
    competition.params = await competition.contract.competitionParams()
  } catch (e) {
    console.error(e);
  }
  return competition
}

export const hasStarted = async competition => {
  try {
    competition.hasStarted = (competition.params.startTime.toNumber() * 1000) <= new Date().getTime()
  } catch (e) {
    console.error(e);
  }
  return competition
}

export const hasEnded = async competition => {
  try {
    competition.hasEnded = Number(competition.params.closeTime.toNumber() * 1000) <= new Date().getTime()
  } catch (e) {
    console.error(e);
  }
  return competition
}

export const getEndedCompetitions = async () => {
  let competitions = await competitionAddresses()
  competitions = competitions.map(address => {
    return {
      contract: getCompetitionContract(address)
    }
  })
  competitions = await Promise.all(competitions.map(competition => isOpen(competition)))
  competitions = competitions.filter(competition => !competition.isOpen)
  competitions = await Promise.all(competitions.map(competition => getCompetitionParams(competition)))
  competitions = await Promise.all(competitions.map(competition => hasEnded(competition)))
  return competitions.filter(competition => competition.hasEnded)
}

export const getStartedCompetitions = async () => {
  let competitions = await competitionAddresses()
  competitions = competitions.map(address => {
    return {
      contract: getCompetitionContract(address)
    }
  })
  competitions = await Promise.all(competitions.map(competition => isOpen(competition)))
  competitions = competitions.filter(competition => competition.isOpen)
  competitions = await Promise.all(competitions.map(competition => getCompetitionParams(competition)))
  competitions = await Promise.all(competitions.map(competition => hasStarted(competition)))
  return competitions.filter(competition => competition.hasStarted)
}

export const getOpenCompetitions = async () => {
  let competitions = await competitionAddresses()
  competitions = competitions.map(address => {
    return {
      contract: getCompetitionContract(address)
    }
  })
  competitions = await Promise.all(competitions.map(competition => isOpen(competition)))
  return competitions.filter(competition => competition.isOpen)
}


export const getCompetitionsToClose = async () => {
  let competitions = await competitionAddresses()
  competitions = competitions.map(address => {
    return {
      contract: getCompetitionContract(address)
    }
  })
  competitions = await Promise.all(competitions.map(competition => isOpen(competition)))
  competitions = competitions.filter(competition => competition.isOpen)
  competitions = await Promise.all(competitions.map(competition => getCompetitionParams(competition)))
  competitions = await Promise.all(competitions.map(competition => hasEnded(competition)))
  return competitions.filter(competition => competition.hasEnded)
}

export const getCompetitionPortfolios = async competition => {
  competition.portfolios = []
  try {
    const members = await competition.contract.getMembers()

    for (const member of members) {
      const portfolio = await competition.contract.membersPortfolios(member)
      competition.portfolios.push({
        member,
        items: portfolio.items
      })
    }
  } catch (e) {
    console.error(e);
  }
  return competition
}

const getLatestCurrencyData = async (id, year, limit = 1) => {
  id = id.replace('[', '').replace(']', '')
  year = year || new Date().getFullYear()
  const currencyRef = firebase.ref(firebase.database, `currencies/${year}/${id}`)
  const snap = await firebase.get(firebase.query(currencyRef, firebase.limitToLast(limit)))
  return await snap.exists() ? await snap.val() : undefined
}

const currencyJob = async (currency, year) => {
  const data = await getLatestCurrencyData(currency.id, year)
  if (data) {
    const points = await calculateFantasyPoints({
      priceDifference: Number(data[Object.keys(data)].marketCapChange24hPercentage),
      volumeDifference: Number(data[Object.keys(data)].volumeChange24hPercentage),
      marketCapDifference: Number(data[Object.keys(data)].rankChange12h) // not used for now
    })
    currency.points = points
  } else  currency.points = 0
  return currency
}

export const getPortfolioPoints = async (portfolios, year) =>  {
  try {
    let response = await fetch(`https://dynasty-api.leofcoin.org/currencies?limit=250&pages=3`)
    response = await response.json()
    const currencies = await Promise.all(response.map(currency => currencyJob(currency, year)))
    const currenciesById = {}
    for (const currency of currencies) {
      currenciesById[currency.id] = currency
    }

    for (const _portfolios of portfolios) {
      for (const portfolio of _portfolios) {
        portfolio.points = portfolio.items.reduce((p, id) => {
          return p + currenciesById[id].points
        }, 0)

        portfolio.items = portfolio.items.map(item => {
          return {
            id: item,
            points: currenciesById[item].points
          }
        })
      }

    }
  } catch (e) {
    console.error(e);
  }

  return portfolios
}


export const getRankings = async portfolios =>  {
  const date = new Date()
  portfolios = await getPortfolioPoints(portfolios, date.getFullYear())
  portfolios = portfolios.map(portfolios => portfolios.map(({member, points, items}) => { return { member, points, items} }))
  portfolios = portfolios.map(portfolios => portfolios.sort((a, b) => b.points - a.points))
  return portfolios
}
