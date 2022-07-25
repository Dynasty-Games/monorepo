const { Contract, utils } = require('ethers')
const ABI = require('../build/abis/DynastyContests.json')
const { DynastyContests } = require('../build/addresses/goerli.json')

module.exports = async (signer) => {
  const contract = new Contract(DynastyContests, ABI, signer)

  try {
    let tx
    const state = await contract.competitionState(0,0,0)
    console.log(state);
    const members = await contract.members(0,0,0)
    console.log(members);
    const portfolio = await contract.memberPortfolio(0,0,0, signer.address)
    console.log(portfolio);
    return true
  } catch (error) {
    console.error(error)
    return false
  }
  
}