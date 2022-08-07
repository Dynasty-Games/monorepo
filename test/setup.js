
const { Contract } = require('ethers')
const ABI = require('../packages/abis/DynastyContests.json')
const treasuryABI = require('../packages/abis/DynastyTreasury.json')
const FakeUSDCABI = require('../packages/abis/FakeUSDC.json')
const DynastyFantasyManagerABI = require('../packages/abis/DynastyFantasyManager.json')
const DynastyFantasyCreditABI = require('../packages/abis/DynastyFantasyCredit.json')
const { DynastyContests, DynastyTreasury, FakeUSDC, DynastyStaking, DynastyFantasyManagerProxy, DynastyFantasyCreditProxy } = require('../packages/addresses/goerli.json')

module.exports = async (signer) => {
  const contract = new Contract(DynastyContests, ABI, signer)  
  const treasuryContract = new Contract(DynastyTreasury, treasuryABI, signer)
  const fakeUSDCContract = new Contract(FakeUSDC, FakeUSDCABI, signer)
  const dynastyFantasyManager = new Contract(DynastyFantasyManagerProxy, DynastyFantasyManagerABI, signer)
  const dynastyCredit = new Contract(DynastyFantasyCreditProxy, DynastyFantasyCreditABI, signer)
  // const proxyManager = new Contract(DynastyTreasury, treasuryABI, signer)  
  try {
    let tx
    const role = await fakeUSDCContract.MINTER_ROLE()
    tx = await fakeUSDCContract.grantRole(role, '0x3283b22dad672171d2c2433f7AeDF9826b3b8274') // minter role
    await tx.wait()
    tx = await dynastyFantasyManager.grantRole(role, DynastyStaking) // minter role
    await tx.wait()
    tx = await dynastyCredit.grantRole(role, DynastyContests) // minter role
    await tx.wait()
    tx = await contract.setToken(DynastyFantasyCreditProxy)
    await tx.wait()
    tx = await contract.addCategory(0, 'crypto')
    await tx.wait()
    tx = await contract.addStyle(0, 'classic', 15)
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