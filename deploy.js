const deploy = require('@leofcoin/project-deploy')

let network
let secret

for (const arg of process.argv) {
  if (arg === '--network') network = process.argv[process.argv.indexOf(arg) + 1]
  if (arg === '--secret') secret = process.argv[process.argv.indexOf(arg) + 1]
}
const manager = '0xECa6984580C50e8E4Af847E3beD878520B4a59b0';

(async (deployer) => {
  // const library = await deploy('contracts/libraries/BridgeUSDC.sol', undefined, undefined, network, secret)
  // const treasury = await deploy('contracts/Treasury.sol', [], [library.address], network, secret)
  // await deploy('contracts/DynastyContest.sol', [manager, treasury.address], undefined, network, secret)
  // const proxyManager = await deploy('contracts/ProxyManager.sol', undefined, undefined, network, secret)
  // const contestsProxy = await deploy('contracts/DynastyContestsProxy.sol', undefined, undefined, network, secret)
  const fakeUSDC = await deploy('contracts/FakeUSDC.sol', undefined, undefined, network, secret)
  const treasury = await deploy('contracts/DynastyTreasury.sol', undefined, undefined, network, secret)
  const contests = await deploy('contracts/DynastyContests.sol', [''], undefined, network, secret)
  
})()