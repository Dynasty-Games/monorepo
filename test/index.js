const test = require('tape')
const secureEnv = require('secure-env')
const { providers, Wallet, Contract, utils } = require('ethers')
const create = require('./create.js')
const enter = require('./enter.js')
const setup = require('./setup.js')
const close = require('./close.js')
const info = require('./info.js')
const config = require('./../project-deploy.config.json')
const ABI = require('./../build/abis/FakeUSDC.json')
const { FakeUSDC, DynastyTreasury } = require('./../build/addresses/goerli.json')

let network
let secret

for (const arg of process.argv) {
  if (arg === '--network') network = process.argv[process.argv.indexOf(arg) + 1]
  if (arg === '--secret') secret = process.argv[process.argv.indexOf(arg) + 1]
}

const dotenvConfig = secret ? secureEnv({secret}) : dotenv.config().parsed

if (!secret && !dotenvConfig[`${network}_PRIVATE_KEY`]) throw new Error(`No key found in .env for ${network}_PRIVATE_KEY`)
if (secret && !dotenvConfig[`${network}_PRIVATE_KEY`]) throw new Error(`No key found in .env for ${network}_PRIVATE_KEY`)

const provider = new providers.JsonRpcProvider(
  config.networks[network].rpcUrl,
  {
    chainId: config.networks[network].chainId
  }
)

const signer = new Wallet(dotenvConfig[`${network}_PRIVATE_KEY`], provider)

const fakeUSDC = new Contract(FakeUSDC, ABI, signer)

test('contracts', async tape => {
  tape.plan(6)

  let ok
  console.log('setting up contracts')
  ok = await setup(signer)
  tape.ok(ok, 'setup contracts')

  console.log('creating competitions')
  ok = await create(signer)
  tape.ok(ok, 'create competitions')

  console.log('mint FakeUSDC')
  let tx = await fakeUSDC.mint(signer.address, utils.parseUnits('100', 8))
  await tx.wait()

  console.log('set allowance')
  tx = await fakeUSDC.approve(DynastyTreasury, utils.parseUnits('10', 8))
  await tx.wait()

  setTimeout(async () => {
    console.log('entering competition')
    ok = await enter(signer)
    tape.ok(ok, 'enter competition')

    console.log('editing competition')
    ok = await enter(signer)
    tape.ok(ok, 'edit competition')

    setTimeout(async () => {
      console.log('closing competition')
      ok = await close(signer)
      tape.ok(ok, 'close competition')
    
      console.log('show competition info')
      ok = await info(signer)
      tape.ok(ok, 'competition info')
    , 240000})
  }, 240000)
})