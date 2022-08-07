const { Contract, utils } = require('ethers')
const ABI = require('../packages/abis/DynastyContests.json')
const { DynastyContestsProxy } = require('../packages/addresses/goerli.json')

module.exports = async (signer) => {
  const contract = new Contract(DynastyContestsProxy, ABI, signer)

  try {
    let tx = await contract.closeCompetition(0, 0, 0, [utils.parseUnits(String(4 - (4 / 100 * 15)), 8)], [signer.address], {gasLimit: 2100000})
    await tx.wait()
    return tx
  } catch (error) {
    console.error(error)
    return false
  }
  
}