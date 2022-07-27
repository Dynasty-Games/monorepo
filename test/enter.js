const { Contract } = require('ethers')
const ABI = require('./../packages/abis/DynastyContests.json')
const { DynastyContests } = require('./../packages/addresses/goerli.json')

module.exports = async (signer) => {
  const contract = new Contract(DynastyContests, ABI, signer)

  try {
    let tx = await contract.submitPortfolio(0, 0, 0, ['btc', 'eth', 'usdc', 'bnb', 'MATIC', 'LTC', 'TRON', 'XRP'])
    await tx.wait()
    return tx
  } catch (error) {
    console.error(error)
    return false
  }
  
}