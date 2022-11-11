export const matrixes = {
  'crypto stars': ({priceDifference, volumeDifference, marketCapDifference}) => {
    priceDifference = Number(priceDifference)
    volumeDifference = Number(volumeDifference)
    marketCapDifference = Number(marketCapDifference)

    let fantasyPoints = 0
    if (priceDifference < 0) {
      fantasyPoints -= (priceDifference / 2)
    } else {
      fantasyPoints += priceDifference
    }

    if (volumeDifference < 0) {
      fantasyPoints -= (volumeDifference / 2)
    } else {
      fantasyPoints += volumeDifference
    }

    if (marketCapDifference < 0) {
      fantasyPoints -= Math.round((marketCapDifference / 50))
    } else {
      fantasyPoints += Math.round(marketCapDifference * 25)
    }
    return Math.round(fantasyPoints * 100) / 100
  }
}

export const calculateFantasyPoints = (value, matrix = 'crypto stars') => {
  return matrixes[matrix.toLowerCase()](value)
}

export const calculateDifference = (a, b) => {
  a = Number(a)
  b = Number(b)
  if (isNaN(a) || isNaN(b)) throw new Error(isNaN(a) ? `a: ${a} isNaN` :  `b: ${b} isNaN`)
  if (a === b) return 0
  if (a < b) {
    if (b === 0) return 0
    return ((b - a) / b) * 100
  } else {
    if (a === 0) return 0
    return -(((a - b) / a) * 100)
  }
}

export const percentageOf = (a, b) => {
  if (a > b) return 100 - calculateDifference(b, a)
  return 100 - calculateDifference(a, b)
}

export const difference = (a, b) => {
  a = Number(a)
  b = Number(b)
  if (isNaN(a) || isNaN(b)) throw new Error(isNaN(a) ? `a: ${a} isNaN` :  `b: ${b} isNaN`)

  if (a < b) {
    if (b === 0) return 0
    return (b - a)
  } else {
    if (a === 0) return 0
    return -(a - b)
  }
}

const differenceOf = (a, b, c) => {
  return (a - b) / (a - c)
}

export const calculateBaseSalary = (set, min = 1000, max = 9000) => {
  const _set = []
  for (let i = 0; i < set.length;  i++) {
    set[i].salary = 1 / Math.log(Number(set[i].marketCap))
    _set.push({...set[i]})
  }

  for (let i = 0; i < set.length;  i++) {
    set[i].salary = differenceOf(_set[0].salary, _set[i].salary, _set[set.length - 1].salary)
    set[i].salary = set[i].salary * (max - min) + min
    set[i].salary = (Math.round(set[i].salary / 100) * 100)
  }
  return set
}

const getWeight = (points) => {
  if (points.weight < 10) return 0
  if (points.weight > 10 && points.weight < 20) return 1
  if (points.weight > 20 && points.weight < 40) return 2
  if (points.weight > 40 && points.weight < 50) return 5
  if (points.weight > 50 && points.weight < 70) return 10
  if (points.weight > 70 && points.weight < 90) return 30
  if (points.weight > 80 && points.weight < 100) return 50
  if (points.weight === 100) return 50
}

const winningsByWeight = {
  100: 50,
  90: 50,
  80: 30,
  70: 30,
  60: 10,
  50: 10,
  40: 5,
  30: 2,
  20: 2,
  10: 1,
  0: 0
}

export const calculateWinnings = (pool, members, points) => {
  console.log(points, members);
  points = points.map((points, i) => {
    points.member = members[i]
    return points
  })
  points = points.sort((a,b) => b.total - a.total)
  const max = points[0].total
  
  points = points.map((points, i) => {
    points.weight = Math.round(percentageOf(points.total, max))

    return points
  })

  let left = pool

  const matchingWeights = points.reduce((set, points) => {
    if (points.weight > 10 && points.weight < 20) set[1] += 1
    if (points.weight > 20 && points.weight < 40) set[2] += 1
    if (points.weight > 40 && points.weight < 50) set[5] += 1
    if (points.weight > 50 && points.weight < 70) set[10] += 1
    if (points.weight > 70 && points.weight < 90) set[30] += 1
    if (points.weight > 80 && points.weight < 100) set[50] += 1
    if (points.weight === 100) set[50] += 1
    return set
  }, {50: 0, 30: 0, 10: 0, 5: 0, 2: 0, 1: 0})
  // const bases = calculateBaseWinnings(points)
  console.log({points});

  let amounts = []
  const _members = []
  
  const amountFor = {}
  for (const percentage of Object.keys(matchingWeights)) {    
    const amountForWeight = (pool / 100 * percentage) 
    left -=  amountForWeight
    amountFor[percentage] = matchingWeights[percentage] > 0 ? amountForWeight / matchingWeights[percentage] : isNaN(matchingWeights[percentage]) ? 0 : matchingWeights[percentage]
  }
  
  
  
  for (const point of points) {
    const percentage = getWeight(point)
    const amount = amountFor[percentage]
    amounts.push(amount > 0 ? amount : 0)
    _members.push(point.member)    
  }

  if (left > 0) {
    // todo send leftovers to treasury
    const amount = left / members.length
    amounts = amounts.map(_amount => _amount + amount)
  }
  


  return {amounts, members: _members, left}
}

/**
 * static list of categories set in contract
 */
export const staticCategories = [
  { name: 'crypto', id: 0 }
]

/**
 * static list of styles set in contract
 */
export const staticStyles = [
  { name: 'classic', fee: 4, id: 0 }
]