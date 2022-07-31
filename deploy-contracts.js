const deploy = require('@leofcoin/project-deploy')
const setup = require('./test/setup.js')
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

  // await setup(contests.signer)
  
  const RLPReader = await deploy('contracts/RLPReader.sol', [], [], network, secret)
  const MerklePatriciaProof = await deploy('contracts/MerklePatriciaProof.sol', [], [], network, secret)
  const Merkle = await deploy('contracts/Merkle.sol', [], [], network, secret)
  const ExitPayloadReader = await deploy('contracts/ExitPayloadReader.sol', [], [], network, secret)

  const contestsRoot = await deploy('contracts/DynastyContestsRoot.sol', ['0x2890bA17EfE978480615e330ecB65333b880928e', '0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA'], [RLPReader.address, MerklePatriciaProof.address, Merkle.address, ExitPayloadReader.address], network, secret)
  const contestsChild = await deploy('contracts/DynastyContestsChild.sol', ['0xCf73231F28B7331BBe3124B907840A94851f9f11'], undefined, 'mumbai', secret)
  

  
})()