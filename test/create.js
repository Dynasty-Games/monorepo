
const { Contract } = require('ethers')
const ABI = require('./../build/abis/DynastyContests.json')
const { DynastyContests } = require('./../build/addresses/goerli.json')

module.exports = async (signer) => {
  const contract = new Contract(DynastyContests, ABI, signer)

  const categories = [0,0,0,0,0,0,0,0,0,0,0,0] // all crypto
  const styles = [0,0,0,0,0,0,0,0,0,0,0,0] // all classic
  const names = ['lambo maker','lambo maker','lambo maker','lambo maker','lambo maker','lambo maker','lambo maker','lambo maker','lambo maker','lambo maker','lambo maker','lambo maker']
  const prices = [4,4,4,4,4,4,4,4,4,4,4,4]
  const prizePools = [10,10,10,10,10,10,10,10,10,10,10,10]
  const portfolioSizes = [8,8,8,8,8,8,8,8,8,8,8,8]
  const potfolioSubmits = [4,4,4,4,4,4,4,4,4,4,4,4]
  
  const date = new Date()
  let nextDay = new Date(date.getTime())
  nextDay.setDate(date.getDate() + 1);

  globalThis.testTime = Math.round(date.getTime() / 1000) + 120

  const startTimes = [
    // Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 01:00:00`).getTime() / 1000),
    testTime,
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 03:00:00`).getTime() / 1000),
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 05:00:00`).getTime() / 1000),
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 07:00:00`).getTime() / 1000),
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 09:00:00`).getTime() / 1000),
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 11:00:00`).getTime() / 1000),
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 13:00:00`).getTime() / 1000),
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 15:00:00`).getTime() / 1000),    
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 17:00:00`).getTime() / 1000),
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 19:00:00`).getTime() / 1000),    
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 23:00:00`).getTime() / 1000),    
    Math.round(new Date(`${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()} 21:00:00`).getTime() / 1000)
  ]

  const liveTimes = startTimes.map(time => time + 120) // 6 hours live 21600
  const endTimes = startTimes.map(time => time + 240) // 12 hours before closed 43200

  try {
    let tx = await contract.createCompetitionBatch(categories, styles, names, prices, prizePools, portfolioSizes, potfolioSubmits, startTimes, liveTimes, endTimes, { gasLimit: 21000000 })
    await tx.wait()
    return tx
  } catch (e) {
    console.error(e);
    return false  
  }
}