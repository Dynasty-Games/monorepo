const { Contract } = require('ethers')
const ABI = require('./../packages/abis/DynastyContests.json')
const { DynastyContestsProxy } = require('./../packages/addresses/goerli.json')

module.exports = async (signer) => {
  const contract = new Contract(DynastyContestsProxy, ABI, signer)

  try {
    let tx = await contract.submitPortfolio(0, 0, 0, ['btc', 'eth', 'usdc', 'bnb', 'MATIC', 'LTC', 'TRON', 'XRP'], 0)
    await tx.wait()
    return tx
  } catch (error) {
    console.error(error)
    return false
  }
  
}