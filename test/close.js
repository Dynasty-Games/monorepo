const { Contract, utils } = require('ethers')
const ABI = require('../packages/abis/DynastyContests.json')
const { DynastyContests } = require('../packages/addresses/goerli.json')

module.exports = async (signer) => {
  const contract = new Contract(DynastyContests, ABI, signer)

  try {
    let tx = await contract.closeCompetitionBatch([0], [0], [0], [10], [signer.address], 0)
    await tx.wait()
    return tx
  } catch (error) {
    console.error(error)
    return false
  }
  
}