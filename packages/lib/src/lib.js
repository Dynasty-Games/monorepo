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
      fantasyPoints -= (marketCapDifference / 50)
    } else {
      fantasyPoints += (marketCapDifference * 25)
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

  if (a < b) {
    if (b === 0) return 0
    return ((b - a) / b) * 100
  } else {
    if (a === 0) return 0
    return -(((a - b) / a) * 100)
  }
}



const differenceOf = (a, b, c) => {
  return (a - b) / (a - c)
}

export const calculateBaseSalary = set => {
  const _set = []
  for (let i = 0; i < set.length;  i++) {
    set[i].salary = 1 / Math.log(Number(set[i].marketCap))
    _set.push({...set[i]})
  }

  for (let i = 0; i < set.length;  i++) {
    set[i].salary = differenceOf(_set[0].salary, _set[i].salary, _set[set.length - 1].salary)
    set[i].salary = set[i].salary * (9000 - 1000) + 1000
    set[i].salary = (Math.round(set[i].salary / 100) * 100)
  }
  return set
}
