const test = require('tape')
const fetch = require('node-fetch')
require('./api.js')

test('@dynasty/api', async tape => {
  tape.plan(14)
  let response = await fetch('http://127.0.0.1:8668/currencies')
  response = await response.json()
  tape.ok(response.length === 100, 'can fetch currencies')

  response = await fetch('http://127.0.0.1:8668/currencies?marketcap=70000000&limit=250&pages=3')
  response = await response.json()
  tape.ok(response.length > 0, 'can fetch currencies by marketCap (70M)')
  console.log(`currencies: ${response.length}`);
  console.log(`lowest marketCap above 70M: ${response[response.length - 1].marketCap}`);

  response = await fetch('http://127.0.0.1:8668/currencies?marketcap=40000000&limit=250&pages=3')
  response = await response.json()
  tape.ok(response.length > 0, 'can fetch currencies by marketCap (40M)')
  console.log(`currencies: ${response.length}`);
  console.log(`lowest marketCap above 40M: ${response[response.length - 1].marketCap}`);

  response = await fetch('http://127.0.0.1:8668/currencies?marketcap=30000000&limit=250&pages=3')
  response = await response.json()
  tape.ok(response.length > 0, 'can fetch currencies by marketCap (30M)')
  console.log(`currencies: ${response.length}`);
  console.log(`lowest marketCap above 30M: ${response[response.length - 1].marketCap}`);

  response = await fetch('http://127.0.0.1:8668/currencies?marketcap=20000000&limit=250&pages=3')
  response = await response.json()
  tape.ok(response.length > 0, 'can fetch currencies by marketCap (20M)')
  console.log(`currencies: ${response.length}`);
  console.log(`lowest marketCap above 20M: ${response[response.length - 1].marketCap}`);

  response = await fetch('http://127.0.0.1:8668/currencies?marketcap=10000000&limit=250&pages=3')
  response = await response.json()
  tape.ok(response.length > 0, 'can fetch currencies by marketCap (10M)')
  console.log(`currencies: ${response.length}`);
  console.log(`lowest marketCap above 10M: ${response[response.length - 1].marketCap}`);

  response = await fetch('http://127.0.0.1:8668/currency-info?id=bitcoin')
  response = await response.json()
  tape.ok(Object.keys(response).length > 0, 'can fetch info')

  response = await fetch('http://127.0.0.1:8668/currency-icon?symbol=1')
  response = await response.text()
  tape.ok(response.includes('https:'), 'can fetch icon')

  response = await fetch('http://127.0.0.1:8668/marketdata')
  response = await response.json()
  tape.ok(response[0].id === 'bitcoin', 'can fetch marketdata')

  response = await fetch('http://127.0.0.1:8668/competitions')
  response = await response.json()
  const competitionAddresses = response
  tape.ok(response.length > 0, 'can fetch competition addresses')

  response = await fetch('http://127.0.0.1:8668/open-competitions')
  response = await response.json()
  tape.ok(response.length > 0, 'can fetch open competition addresses')

  response = await fetch('http://127.0.0.1:8668/competitions/params')
  response = await response.json()
  tape.ok(response.length > 0, 'can fetch competition params')

  response = await fetch('http://127.0.0.1:8668/open-competitions/params')
  response = await response.json()
  tape.ok(response.length > 0, 'can fetch open competition params')

  response = await fetch(`http://127.0.0.1:8668/open-competitions/params?address=${competitionAddresses[0]}`)
  response = await response.json()
  tape.ok(response.name, 'can fetch open competition params by address')

  setTimeout(() => {
    process.exit(0)
  }, 50);
})
