import { calculateFantasyPoints } from './../../lib/lib.js'
import { dynastyContest as contract } from './contracts'
import { closedCompetitions, currencies } from '../../utils/src/utils'

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

export const getCompetitionPortfolios = async competition => {
  competition.portfolios = []
  const { category, style, id } = competition

  try {
    let members = await contract.members(category, style, id)
    if (members.length > 0) {
      for (const member of members) {
        const portfolio = await contract.memberPortfolio(category, style, id, member)
        competition.portfolios.push({
          member,
          items: portfolio.items
        })
      }
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
    let response = await currencies('limit=250&pages=3')
    response = await response.json()
    response = await Promise.all(response.map(currency => currencyJob(currency, year)))
    const currenciesById = {}
    for (const currency of response) {
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

export const totalCompetitions = async ({category, style}, data) => {
  const totalCompetitions = await contract.totalCompetitions(category, style)
  data.push({
    totalCompetitions: totalCompetitions.toNumber(),
    category,
    style
  })
  return data
}

export const competitions = async () => {
  const categoriesLength = await contract.categoriesLength()
  const stylesLength = await contract.stylesLength()

  let queue = []
  
  for (let category = 0; category < categoriesLength; category++) {
    for (let style = 0; style < stylesLength; style++) {
      queue.push({category, style})
    }
  }

  let data = []

  await runQueue(data, queue, totalCompetitions)
}

export const getCompetitionsToClose = async () => {
  const competitions = await closedCompetitions()
  return competitions.filter(competition => competition.state === 0)
}

export const getMembers = async (category, style, id) => {
  return await contract.members(category, style, id)
}

export const getPortfolios = async (category, style, id, members) => {
  return Promise.all(members.map(member => contract.memberPortfolio(category, style, id, member)))
}

export const portfolioPoints = async (portfolio) => {
  
  let stamps = await Promise.all(portfolio.map(id => storage.readDir(`currencies/${id}`)))  
  let points = await Promise.all(portfolio.map(async (id, i) => {
    stamps[i] = stamps[i].map(stamp => stamp.split('.data')[0])

    stamps[i] = stamps[i].sort((a, b) => b - a)
    return (JSON.parse((await storage.get(`currencies/${id}/${stamps[i][0]}`)).toString())).points
  }))

  const total = points.reduce((prev, curr) => {
    return prev + curr
  }, 0)

  return {total, points}
}
