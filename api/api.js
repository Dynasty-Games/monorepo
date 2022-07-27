'use strict';

var Koa = require('koa');
var cors = require('@koa/cors');
var Router = require('@koa/router');
var fetch = require('node-fetch');
var competitionABI = require('@dynasty-games/abis/Competition-ABI.json');
var ethers = require('ethers');
var addresses$1 = require('@dynasty-games/addresses/goerli.json');
var contestsABI = require('@dynasty-games/abis/DynastyContest-ABI.json');
require('path');
var DynastyContest = require('@dynasty-games/abis/USDDToken.json');
require('dotenv/config');
var lib = require('@dynasty-games/lib');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var competitionABI__default = /*#__PURE__*/_interopDefaultLegacy(competitionABI);
var addresses__default = /*#__PURE__*/_interopDefaultLegacy(addresses$1);
var contestsABI__default = /*#__PURE__*/_interopDefaultLegacy(contestsABI);
var DynastyContest__default = /*#__PURE__*/_interopDefaultLegacy(DynastyContest);

globalThis.__cache__ = globalThis.__cache__ || {};

const add$1 = (key, value) => {
  __cache__[key] = value;
};

const get$1 = key => {
  return __cache__[key]
};

const remove$1 = (key) => {
  delete __cache__[key];
};

var cache = {
  add: add$1,
  get: get$1,
  remove: remove$1
};

globalThis.__timestamps__ = globalThis.__timestamps__ || {};

const add = (key, value) => {
  __timestamps__[key] = value;
};

const get = key => {
  return __timestamps__[key]
};

const remove = (key) => {
  delete __timestamps__[key];
};

var timestamps = {
  add,
  get,
  remove
};

const baseApiURL$1 = 'https://api.coingecko.com/api/v3/';

var getMarketData = async (vsCurrency = 'usd', limit = '250', pages = '1', order = 'market_cap_desc') => {
  let items = [];
  for (let i = 1; i <= Number(pages); i++) {
    const query = `?vs_currency=${vsCurrency}&order=${order}&per_page=${limit}&page=${i}&sparkline=false`;
    const url = `${baseApiURL$1}coins/markets${query}`;
    const response = await fetch__default["default"](url);
    const item = await response.json();
    items = [...items, ...item];
  }
  return items
};

const router$2 = new Router__default["default"]();

const baseApiURL = 'https://api.coingecko.com/api/v3/';
// TODO: currencies sould just return all info except the marketdata

router$2.get('/currencies', async (ctx, next) => {
  const limit = ctx.query.limit ? Number(ctx.query.limit) : 100;
  let data = cache.get('marketdata');
  if (data && Number(ctx.query.pages) > 2) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, ctx.query.pages);
  if (!data) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, ctx.query.pages);
  data = data.slice(0, ctx.query.pages ? limit * Number(ctx.query.pages) : limit);
  if (ctx.query.marketcap) {
    data = data.filter(currency => currency.market_cap > Number(ctx.query.marketcap));
  }
  ctx.body = data.map(({
    name, id, symbol, image, current_price, total_supply, salary,
    total_volume, market_cap_rank, circulating_supply,
    price_change_percentage_24h, roi, market_cap,
    market_cap_change_percentage_24h, max_supply
  }) => {
    return {
      name,
      symbol,
      image,
      roi,
      id,
      salary,
      marketCap: market_cap,
      marketCapChange24hPercentage: market_cap_change_percentage_24h,
      priceChange24hPercentage: price_change_percentage_24h,
      circulatingSupply: circulating_supply,
      rank: market_cap_rank,
      totalSupply: total_supply,
      volume: total_volume,
      price: current_price,
      maxSupply: max_supply
    }
  });
});

router$2.get('/marketdata', async (ctx, next) => {
  const limit = ctx.query.limit ? Number(ctx.query.limit) : 100;
  let data = cache.get('marketdata');
  if (!data || data?.length === 0 ) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, ctx.query.pages);
  ctx.body = data.splice(0, limit);
});

router$2.get('/currency-info', async (ctx, next) => {
  let data = cache.get(`currency_${ctx.query.id}`);
  if (!data || new Date().getTime() > timestamps.get(`currency_${ctx.query.id}`) + (5 * 60000)) {
    const url = `${baseApiURL}coins/${ctx.query.id}?tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`;
    let response = await fetch__default["default"](url);
    data = await response.json();
    cache.add(`currency_${ctx.query.id}`);
  }
  ctx.body = data;
});

router$2.get('/currency-icon', async (ctx, next) => {
  ctx.body = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${ctx.query.symbol.toLowerCase()}.svg`;
});

const network$1 = ethers.providers.getNetwork('goerli');

var provider$1 = ethers.getDefaultProvider(network$1, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
});

const queue$1 = [];

const job$1 = async (contract, data) => {
  const open = await contract.isOpen();
  if (open) {
    const params = await contract.competitionParams();
    const participants = await contract.membersCount();
    const isOpen = await contract.isOpen();
    data.open.push(contract.address);
    data.params[contract.address] = {
      address: contract.address,
      style: params.style,
      category: params.category,
      closeTime: Number(params.closeTime.toString()) * 1000,
      feeDGC: ethers.utils.formatUnits(params.feeDGC, 0),
      interestPct: ethers.utils.formatUnits(params.interestPct, 0),
      portfolioSize: params.portfolioSize.toNumber(),
      participants: participants.toNumber(),
      name: params.name,
      startTime: Number(params.startTime.toNumber() * 1000).toString(),
      totalPrizeDGC: ethers.utils.formatUnits(params.totalPrizeDGC, 0),
      isOpen
    };
  }
  return data
};

const _runQueue$1 = (contracts, data) => Promise.all(contracts.map(contract => job$1(contract, data)));
const runQueue$1 = async data => {
  await _runQueue$1(queue$1.splice(0, queue$1.length > 12 ? 12 : queue$1.length), data);
  if (queue$1.length > 0) return runQueue$1(data)
};

var competitions$1 = async () => {
  const contract = await new ethers.Contract(addresses$1.DynastyContest, contestsABI__default["default"], provider$1);
  let addresses = await contract.getCompetitionsList();

  let data = {
    addresses,
    open: [],
    params: {}
  };

  addresses = [...addresses].reverse();

  for (const address of addresses) {
    const contract = new ethers.Contract(address, competitionABI__default["default"], provider$1);
    queue$1.push(contract);
  }
  await runQueue$1(data);
  return data
};

const queue = [];

const job = async ({contract, category, style}, data) => {
  const open = await contract.isOpen();
  if (open) {
    const params = await contract.competitionParams();
    const participants = await contract.membersCount();
    const isOpen = await contract.isOpen();
    data.open.push(contract.address);
    data.params[contract.address] = {
      address: contract.address,
      style: params.style,
      category: params.category,
      closeTime: Number(params.closeTime.toString()) * 1000,
      feeDGC: ethers.utils.formatUnits(params.feeDGC, 0),
      interestPct: ethers.utils.formatUnits(params.interestPct, 0),
      portfolioSize: params.portfolioSize.toNumber(),
      participants: participants.toNumber(),
      name: params.name,
      startTime: Number(params.startTime.toNumber() * 1000).toString(),
      totalPrizeDGC: ethers.utils.formatUnits(params.totalPrizeDGC, 0),
      isOpen
    };
  }
  return data
};

const _runQueue = (contracts, data) => Promise.all(contracts.map(contract => job(contract, data)));
const runQueue = async data => {
  await _runQueue(queue.splice(0, queue.length > 12 ? 12 : queue.length), data);
  if (queue.length > 0) return runQueue(data)
};

var categories = async () => {
  const contract = await new ethers.Contract(addresses$1.DynastyContest, contestsABI__default["default"], provider$1);
  const categoriesLength = await contract.categoriesLength();
  const stylesLength = await contract.stylesLength();
  
  for (let category = 0; category < categoriesLength; i++) {
    for (let i = 0; i < stylesLength; i++) {
      queue.push({
        contract,
        category,
        style
      });
    }  
  }

  let data = {
    addresses,
    open: [],
    params: {}
  };
  return runQueue(data)
};

const router$1 = new Router__default["default"]();

router$1.get('/competitionsByCategory', async ctx => {
  
  let data = cache.get('/categories');
  if (!data) {
    data = await categories();
    cache.add('/categories', data);
  }
  ctx.body = data[ctx.query.category];
});

/**
 * fetch('/contest?id=lambomaker')
 */
router$1.get('/competitions', async ctx => {
  let data = cache.get('competitions');
  if (data) ctx.body = data.addresses;
  else {
    data = await competitions$1();
    cache.add('competitions', data);
    ctx.body = data.addresses;
  }
});

router$1.get('/open-competitions', async ctx => {
  let data = cache.get('competitions');
  if (data) ctx.body = data.open;
  else {
    data = await competitions$1();
    cache.add('competitions', data);
    ctx.body = data.open;
  }
});

router$1.get('/competitions/params', async ctx => {
  const wantedAddress = ctx.query.address;
  const data = cache.get('competitions');
  let cachedItems = cache.get('competition-params');

  let addresses;
  if (cachedItems?.addresses?.length > 0) addresses = data.addresses.filter(address => cachedItems.addresses.indexOf(address) === -1);
  else {
    addresses = data.addresses;
    cachedItems = {
      addresses: [],
      params: []
    };
  }

  const contracts = addresses.map(address => new ethers.Contract(address, competitionABI__default["default"], provider$1));
  let params = await Promise.all(contracts.map(contract => contract.competitionParams()));
  const participants = await Promise.all(contracts.map(contract => contract.membersCount()));

  params = [...cachedItems.params, ...params.map((current, i) => ({
    address: contracts[i].address,
    participants: participants[i].toNumber(),
    category: current.category,
    feeDGC: ethers.utils.formatUnits(current.feeDGC, 0),
    interestPct: ethers.utils.formatUnits(current.interestPct, 0),
    name: current.name,
    style: current.style,
    portfolioSize: current.portfolioSize.toNumber(),
    closeTime: Number(current.closeTime.toString()) * 1000,
    startTime: Number(current.startTime.toNumber()) * 1000,
    totalPrizeDGC: ethers.utils.formatUnits(current.totalPrizeDGC, 0)
  }))];

  cache.add('competition-params', {
    addresses: [...addresses, ...cachedItems.addresses],
    params
  });

  if (wantedAddress) {
    ctx.body = params.filter(c => c.address?.toLowerCase() === wantedAddress.toLowerCase());
  } else {
    ctx.body = params;
  }
});

router$1.get('/open-competitions/params', async ctx => {
  const wantedAddress = ctx.query.address;
  const data = cache.get('competitions');

  ctx.body = wantedAddress ? data.params[wantedAddress] : Object.values(data.params);
});

// import cache from './../cache'
// import WebSocket from 'websocket'
const router = new Router__default["default"]();

const timedOut = {};

const network = ethers.providers.getNetwork('goerli');

const provider = ethers.getDefaultProvider(network, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
});

// random key for tests
const signer = new ethers.Wallet(process.env?.FAUCET_PRIVATE_KEY, provider);

const contract = new ethers.Contract(addresses__default["default"].USDDToken, DynastyContest__default["default"], signer);

const timedOutMessage = ctx => {
  ctx.body = `${ctx.request.query.address} on timeout till ${new Date(timedOut[ctx.request.query.address] + 43200 * 1000)}`;
};

router.get('/faucet', async ctx => {
  try {
    if (timedOut[ctx.request.query.address] + 43200 < Math.round(new Date().getTime() / 1000)) return timedOutMessage(ctx)
    let tx = await contract.freemint(ctx.request.query.address, ethers.utils.parseUnits('100'));
    const hash = tx.hash;
    await tx.wait();
    tx = await signer.sendTransaction({
      to: ctx.request.query.address,
      value: ethers.utils.parseUnits('0.01')
    });
    await tx.wait();
    // console.log(tx);
    ctx.body = JSON.stringify({
      dgc: hash,
      ether: tx.hash,
      address: addresses__default["default"].USDDToken
    });
    // TODO: finish timeout
    timedOut[ctx.request.query.address] = Math.round(new Date().getTime() / 1000);
  } catch (e) {
    console.error(e);
  }
});

router.get('/faucet/tot', timedOutMessage);

var marketdata = async () => {
  let data = await getMarketData('usd', '150', '2');
  data = data.map(currency => {
    currency.marketCap = currency.market_cap;
    return currency
  });
  cache.add('_marketdata', data);
};

var calculateSalary = async () => {
  let data = cache.get('_marketdata');
  data = lib.calculateBaseSalary(data.slice(0, 300));
  cache.add('marketdata', data);
};

var competitions = async () => {
  const data = await competitions$1();
  cache.add('competitions', data);
};

// import firebase from './../firebase'
// import 'dotenv/config'

class JobRunner {
  constructor() {
    // 5 min timeout
    this.timeout = 5 * 60000;
    this.jobs = [
      marketdata,
      calculateSalary,
      competitions
    ];

    this.runJobs = this.runJobs.bind(this);

    this.#init();

  }

  async #init() {
    // await firbase.signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD)
    await this.runJobs();
  }
  // some need other jobs to be finished first so jobs are run sync
  async runJobs() {

    for (const job of this.jobs) {
      await job();
    }
    setTimeout(this.runJobs, this.timeout);
  }
}

new JobRunner();
const server = new Koa__default["default"]();

server
  .use(cors__default["default"]({ origin: '*' }))
  .use(router$2.routes())
  .use(router.routes())
  .use(router$1.routes())
  .use(router$2.allowedMethods());

server.listen(8668);
