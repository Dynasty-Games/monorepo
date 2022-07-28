
const { Contract } = require('ethers')
const ABI = require('../packages/abis/DynastyContests.json')
const treasuryABI = require('../packages/abis/DynastyTreasury.json')
const { DynastyContests, DynastyTreasury, FakeUSDC } = require('../packages/addresses/goerli.json')

module.exports = async (signer) => {
  const contract = new Contract(DynastyContests, ABI, signer)  
  const treasuryContract = new Contract(DynastyTreasury, treasuryABI, signer)  
  // const proxyManager = new Contract(DynastyTreasury, treasuryABI, signer)  
  try {
    let tx
    // todo split contract into logic and storage
    // init proxy before setting it up
    // tx = await proxyManager.upgrade(addresses.DynastyContestsProxy, DynastyContests)
    // await tx.wait()
    tx = await contract.addCategory(0, 'crypto')
    await tx.wait()
    tx = await contract.addStyle(0, 'classic')
    await tx.wait()
    tx = await contract.setTreasury(DynastyTreasury)
    await tx.wait()
    tx = await treasuryContract.setInputToken(FakeUSDC)
    await tx.wait()
    tx = await treasuryContract.setTreasuryFee(15)
    await tx.wait()
    return tx
  } catch (e) {
    console.error(e);
    return false  
  }
}