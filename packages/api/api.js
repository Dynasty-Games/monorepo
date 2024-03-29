import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import fetch$1 from 'node-fetch';
import ethers, { providers, getDefaultProvider, Wallet, Contract, utils } from 'ethers';
import 'dotenv/config';
import cron from 'node-cron';
import multiavatar from '@multiavatar/multiavatar';
import client from 'socket-request-client';

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

var getMarketData = async (vsCurrency = 'usd', limit = '250', pages = '25', order = 'market_cap_desc') => {  
  let items = [];
  try {
    let items = [];
    for (let i = 1; i <= Number(pages); i++) {
      const query = `?vs_currency=${vsCurrency}&order=${order}&per_page=${limit}&page=${i}&sparkline=false`;
      const url = `${baseApiURL$1}coins/markets${query}`;
      const response = await fetch(url);
      const item = await response.json();
      console.log(item);
      if (Array.isArray(item)) items = [...items, ...item];
    }
    
  } catch (error) {
    console.log(error);
    throw error
  }
  console.log(items);
  return items
};

const router$5 = new Router();

const baseApiURL = 'https://api.coingecko.com/api/v3/';
// TODO: currencies sould just return all info except the marketdata

router$5.get('/currencies', async (ctx, next) => {
  const limit = ctx.query.limit ? Number(ctx.query.limit) : 250;
  const pages = ctx.query.pages ? Number(ctx.query.pages) : 25;
  
  let data = cache.get('marketdata');
  if (data && pages > 25) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, pages);
  if (!data) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, pages);
  
  data = data.slice(0, pages ? limit * pages : limit);

  if (ctx.query.maxMarketcap) {
    data = data.filter(currency => currency.marketCap <= Number(ctx.query.maxMarketcap));
  }
  if (ctx.query.minMarketcap) {
    data = data.filter(currency => currency.marketCap >= Number(ctx.query.minMarketcap));
  }

  if (ctx.query.minVolume) {
    data = data.filter(currency => currency.volume >= Number(ctx.query.minVolume));
  }
  
  if (ctx.query.maxVolume) {
    data = data.filter(currency => currency.volume <= Number(ctx.query.maxVolume));
  }
  
  ctx.body = JSON.stringify(data, null, '\t');
});

router$5.get('/marketdata', async (ctx, next) => {
  const limit = ctx.query.limit ? Number(ctx.query.limit) : 250;
  let data = cache.get('marketdata');
  if (!data || data?.length === 0 ) data = await getMarketData(ctx.query.vsCurrency || 'usd', limit, ctx.query.pages);
  ctx.body = data.splice(0, limit);
});

router$5.get('/currency-info', async (ctx, next) => {
  let data = cache.get(`currency_${ctx.query.id}`);
  if (!data || new Date().getTime() > timestamps.get(`currency_${ctx.query.id}`) + (5 * 60000)) {
    const url = `${baseApiURL}coins/${ctx.query.id}?tickers=false&market_data=false&community_data=true&developer_data=false&sparkline=false`;
    let response = await fetch$1(url);
    data = await response.json();
    data = {
      description: data.description.en,
      links: data.links
    };
    cache.add(`currency_${ctx.query.id}`, data);
  }
  ctx.body = data;
});

router$5.get('/currency-icon', async (ctx, next) => {
  ctx.body = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${ctx.query.symbol.toLowerCase()}.svg`;
});

const router$4 = new Router();

const filter = ctx => {
  
  const { category, style, id, name } = ctx.request.query;

  ctx.body = ctx.body.filter(item => {
    if (category && style && id && name) return item.category === Number(category) && item.style === Number(style) && item.id === Number(id) && item.name.toLowerCase() === name
    if (category && style && id) return item.category === Number(category) && item.style === Number(style) && item.id === Number(id)
    if (category && style && name) return item.category === Number(category) && item.style === Number(style) && item.name.toLowerCase() === name
    if (category && style) return item.category === Number(category) && item.style === Number(style)
    if (category && name) return item.category === Number(category) && item.name.toLowerCase() === name
    if (name && style) return item.name.toLowerCase() === name && item.style === Number(style)
    
    if (id) return item.id === Number(id)
    if (name) return item.name.toLowerCase() === name
    if (category) return item.category === Number(category)
    if (style) return item.style === Number(style)
    return true
  });
  return 
};

// router.get('/competitionsByCategory', async ctx => {
  
//   let data = cache.get('/categories')
//   if (!data) {
//     data = await categories()
//     cache.add('/categories', data)
//   }
//   ctx.body = data[ctx.query.category]
// })

/**
 * fetch('/contest?id=lambomaker')
 */
router$4.get('/competitions', async ctx => {
  ctx.body = JSON.parse((await storage.get('/competitions/competitions')).toString());
  filter(ctx);
});

router$4.get('/open-competitions', async ctx => {
  ctx.body = JSON.parse((await storage.get('/competitions/open')).toString());
  filter(ctx);
});

router$4.get('/closed-competitions', async ctx => {
  ctx.body = JSON.parse((await storage.get('/competitions/closed')).toString());
  filter(ctx);
});

router$4.get('/live-competitions', async ctx => {
  ctx.body = JSON.parse((await storage.get('/competitions/live')).toString());  
  filter(ctx);
});

router$4.get('/competition-result', async ctx => {
  ctx.body = JSON.parse((await storage.get(`/competitions/results/${ctx.query.id}`)).toString());  
  filter(ctx);
});

var FakeUSDC$1 = [
	{
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "previousAdminRole",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "newAdminRole",
				type: "bytes32"
			}
		],
		name: "RoleAdminChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			}
		],
		name: "RoleGranted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			}
		],
		name: "RoleRevoked",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DEFAULT_ADMIN_ROLE",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "MINTER_ROLE",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "burn",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "burnFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "subtractedValue",
				type: "uint256"
			}
		],
		name: "decreaseAllowance",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			}
		],
		name: "getRoleAdmin",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "grantRole",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "hasRole",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "addedValue",
				type: "uint256"
			}
		],
		name: "increaseAllowance",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "mint",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "minterBurn",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "renounceRole",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "revokeRole",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4"
			}
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var FakeUSDC = "0xab5417222849D9bF8F55059502E86bDDdb496fB5";
var DynastyTreasury = "0xE7C5B5Cd9DF18281C043084A4dF872d942C2af33";
var DynastyContests = "0xaAF97b567DE574C13E8b435F995bD77B72A035A2";
var RLPReader = "0x193481aDcd1223c80105c5431A9028b49B7D99a4";
var MerklePatriciaProof = "0xc7D9c2A86e23dB3eAd63A731c0a39890Ba64207E";
var Merkle = "0x05DB74e048b48E98e04cA0cc6eA2ABe3d7De2744";
var ExitPayloadReader = "0x43126E5EC8738658723d1Fa3cA1cA4C14Fa4d8C6";
var FxStateRootTunnel = "0xf4C2893E33bA5f84CCc66B6775a4AaB1Ab06020b";
var ProxyManager = "0x210aa4A654924eFfcFf1A06c6bb793626b31eEC7";
var DynastyStaking = "0x95Eb6a6803c6DB419ab0314BF8199889D06BeDFA";
var DynastyStakinProxy = "0xb4162062517B4eb8de6Bb0FC2C1411Ed426d2FE2";
var DynastyFantasyManager = "0xB275CE9437454a67475eF0e0fce0850dcD7C3cDc";
var DynastyStakingProxy = "0x5E2e1892Eb468d3c0dFBAEb18d4e15443f2F50ee";
var DynastyFantasyManagerProxy = "0xb2Ac4E92c8f741b9eE9A70C589a55159746AB930";
var DynastyFantasyCredit = "0x99B17EA9F4Ca3DEEE2576c3E1090db096C3AA930";
var DynastyFantasyCreditProxy = "0x87507E1Af51DAfff97406F31138225D8A2eb4990";
var DynastyContestsProxy = "0x1F5AdDc03bef6227e11c4449adcD3431BbD1386A";
var addresses = {
	FakeUSDC: FakeUSDC,
	DynastyTreasury: DynastyTreasury,
	DynastyContests: DynastyContests,
	RLPReader: RLPReader,
	MerklePatriciaProof: MerklePatriciaProof,
	Merkle: Merkle,
	ExitPayloadReader: ExitPayloadReader,
	FxStateRootTunnel: FxStateRootTunnel,
	ProxyManager: ProxyManager,
	DynastyStaking: DynastyStaking,
	DynastyStakinProxy: DynastyStakinProxy,
	DynastyFantasyManager: DynastyFantasyManager,
	DynastyStakingProxy: DynastyStakingProxy,
	DynastyFantasyManagerProxy: DynastyFantasyManagerProxy,
	DynastyFantasyCredit: DynastyFantasyCredit,
	DynastyFantasyCreditProxy: DynastyFantasyCreditProxy,
	DynastyContestsProxy: DynastyContestsProxy
};

// import cache from './../cache'
// import WebSocket from 'websocket'
const router$3 = new Router();

const timedOut = {};

const network$1 = providers.getNetwork('goerli');

const provider$1 = getDefaultProvider(network$1, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
});

// random key for tests
const signer = new Wallet(process.env?.FAUCET_PRIVATE_KEY, provider$1);

const contract$1 = new Contract(addresses.FakeUSDC, FakeUSDC$1, signer);

const timedOutMessage = ctx => {
  ctx.body = `${ctx.request.query.address} on timeout till ${new Date(timedOut[ctx.request.query.address] + 43200 * 1000)}`;
};

router$3.get('/faucet', async ctx => {
  try {
    if (timedOut[ctx.request.query.address] + 43200 < Math.round(new Date().getTime() / 1000)) return timedOutMessage(ctx)
    let tx = await contract$1.mint(ctx.request.query.address, utils.parseUnits('100', 8));
    const hash = tx.hash;
    await tx.wait();
    tx = await signer.sendTransaction({
      to: ctx.request.query.address,
      value: utils.parseUnits('0.01')
    });
    await tx.wait();
    // console.log(tx);
    ctx.body = JSON.stringify({
      dgc: hash,
      ether: tx.hash,
      address: addresses.FakeUSDC
    });
    // TODO: finish timeout
    timedOut[ctx.request.query.address] = Math.round(new Date().getTime() / 1000);
  } catch (e) {
    console.error(e);
  }
});

router$3.get('/faucet/tot', timedOutMessage);

var marketdata = async () => {
  try {
    let data = await getMarketData('usd', '250', '25');
    data = data.map(({
      name,
      id,
      symbol,
      image,
      current_price,
      total_supply,
      salary,
      total_volume,
      market_cap_rank,
      circulating_supply,
      price_change_percentage_24h,
      roi,
      market_cap,
      market_cap_change_percentage_24h,
      max_supply
    }, i) => {
      return {
        name,
        rank: i + 1,
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
    
    cache.add('_marketdata', data);
  } catch (error) {
    console.warn('marketdata');
    console.warn(error);
  }
};

var contestsABI = [
	{
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "id",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "string",
				name: "name",
				type: "string"
			}
		],
		name: "CategoryChange",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint8",
				name: "version",
				type: "uint8"
			}
		],
		name: "Initialized",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "previousAdminRole",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "newAdminRole",
				type: "bytes32"
			}
		],
		name: "RoleAdminChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			}
		],
		name: "RoleGranted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			}
		],
		name: "RoleRevoked",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "id",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "string",
				name: "name",
				type: "string"
			}
		],
		name: "StyleChange",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "competitionId_",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "member_",
				type: "address"
			}
		],
		name: "SubmitPortfolio",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "erc20Token",
				type: "address"
			}
		],
		name: "TreasuryChange",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DEFAULT_ADMIN_ROLE",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "MANAGER_ROLE",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "MINTER_ROLE",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "PAUSER_ROLE",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "string",
				name: "name_",
				type: "string"
			}
		],
		name: "addCategory",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "string",
				name: "name_",
				type: "string"
			},
			{
				internalType: "uint256",
				name: "fee_",
				type: "uint256"
			}
		],
		name: "addStyle",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "categoriesLength",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "id",
				type: "uint256"
			}
		],
		name: "category",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "string",
				name: "name_",
				type: "string"
			}
		],
		name: "changeCategory",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "string",
				name: "name_",
				type: "string"
			},
			{
				internalType: "uint256",
				name: "fee_",
				type: "uint256"
			}
		],
		name: "changeStyle",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "competitionId_",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "amounts_",
				type: "uint256[]"
			},
			{
				internalType: "address[]",
				name: "members_",
				type: "address[]"
			}
		],
		name: "closeCompetition",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "competitionId",
				type: "uint256"
			}
		],
		name: "competition",
		outputs: [
			{
				components: [
					{
						internalType: "string",
						name: "name",
						type: "string"
					},
					{
						internalType: "uint256",
						name: "id",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "price",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "prizePool",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "portfolioSize",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "freeSubmits",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "startTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "liveTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "endTime",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "extraData",
						type: "bytes"
					},
					{
						internalType: "address[]",
						name: "members",
						type: "address[]"
					},
					{
						internalType: "enum DynastyContestsStorageUpgradeable.States",
						name: "state",
						type: "uint8"
					}
				],
				internalType: "struct DynastyContestsStorageUpgradeable.Competition",
				name: "",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "competitionId",
				type: "uint256"
			}
		],
		name: "competitionState",
		outputs: [
			{
				internalType: "enum DynastyContestsStorageUpgradeable.States",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			}
		],
		name: "competitionsByCategoryAndStyle",
		outputs: [
			{
				components: [
					{
						internalType: "string",
						name: "name",
						type: "string"
					},
					{
						internalType: "uint256",
						name: "id",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "price",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "prizePool",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "portfolioSize",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "freeSubmits",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "startTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "liveTime",
						type: "uint256"
					},
					{
						internalType: "uint256",
						name: "endTime",
						type: "uint256"
					},
					{
						internalType: "bytes",
						name: "extraData",
						type: "bytes"
					},
					{
						internalType: "address[]",
						name: "members",
						type: "address[]"
					},
					{
						internalType: "enum DynastyContestsStorageUpgradeable.States",
						name: "state",
						type: "uint8"
					}
				],
				internalType: "struct DynastyContestsStorageUpgradeable.Competition[]",
				name: "",
				type: "tuple[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "categories_",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "styles_",
				type: "uint256[]"
			},
			{
				internalType: "string[]",
				name: "names_",
				type: "string[]"
			},
			{
				internalType: "uint256[]",
				name: "prices_",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "pricePools_",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "portfolioSizes_",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "submits",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "startTimes_",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "liveTimes_",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "endTimes_",
				type: "uint256[]"
			},
			{
				internalType: "bytes[]",
				name: "extraData_",
				type: "bytes[]"
			}
		],
		name: "createCompetitionBatch",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			}
		],
		name: "getRoleAdmin",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "grantRole",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "hasRole",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "competitionId",
				type: "uint256"
			}
		],
		name: "isLive",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "competitionId",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "member_",
				type: "address"
			}
		],
		name: "isMember",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "competitionId",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "member",
				type: "address"
			}
		],
		name: "memberPortfolio",
		outputs: [
			{
				components: [
					{
						internalType: "string[]",
						name: "items",
						type: "string[]"
					},
					{
						internalType: "uint256",
						name: "submits",
						type: "uint256"
					}
				],
				internalType: "struct DynastyContestsStorageUpgradeable.Portfolio",
				name: "",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "competitionId",
				type: "uint256"
			}
		],
		name: "members",
		outputs: [
			{
				internalType: "address[]",
				name: "",
				type: "address[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "renounceRole",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32"
			},
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "revokeRole",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token_",
				type: "address"
			}
		],
		name: "setToken",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "treasury",
				type: "address"
			}
		],
		name: "setTreasury",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "id",
				type: "uint256"
			}
		],
		name: "style",
		outputs: [
			{
				components: [
					{
						internalType: "string",
						name: "name",
						type: "string"
					},
					{
						internalType: "uint256",
						name: "fee",
						type: "uint256"
					}
				],
				internalType: "struct DynastyContestsStorageUpgradeable.Style",
				name: "",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "stylesLength",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "competitionId_",
				type: "uint256"
			},
			{
				internalType: "string[]",
				name: "items",
				type: "string[]"
			},
			{
				internalType: "uint256",
				name: "withCredits_",
				type: "uint256"
			}
		],
		name: "submitPortfolio",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4"
			}
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "token",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			}
		],
		name: "totalCompetitions",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "style_",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "competitionId",
				type: "uint256"
			}
		],
		name: "totalMembers",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

const network = providers.getNetwork('goerli');

var provider = getDefaultProvider(network, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
});

const matrixes = {
  'crypto stars': ({priceDifference, volumeDifference, marketCapDifference}) => {
    priceDifference = Number(priceDifference);
    volumeDifference = Number(volumeDifference);
    marketCapDifference = Number(marketCapDifference);

    let fantasyPoints = 0;
    if (priceDifference < 0) {
      fantasyPoints -= (priceDifference / 2);
    } else {
      fantasyPoints += priceDifference;
    }

    if (volumeDifference < 0) {
      fantasyPoints -= (volumeDifference / 2);
    } else {
      fantasyPoints += volumeDifference;
    }

    if (marketCapDifference < 0) {
      fantasyPoints -= Math.round((marketCapDifference / 50));
    } else {
      fantasyPoints += Math.round(marketCapDifference * 25);
    }
    return Math.round(fantasyPoints * 100) / 100
  }
};

const calculateFantasyPoints = (value, matrix = 'crypto stars') => {
  return matrixes[matrix.toLowerCase()](value)
};

const calculateDifference = (a, b) => {
  a = Number(a);
  b = Number(b);
  if (isNaN(a) || isNaN(b)) throw new Error(isNaN(a) ? `a: ${a} isNaN` :  `b: ${b} isNaN`)
  if (a === b) return 0
  if (a < b) {
    if (b === 0) return 0
    return ((b - a) / b) * 100
  } else {
    if (a === 0) return 0
    return -(((a - b) / a) * 100)
  }
};

const difference = (a, b) => {
  a = Number(a);
  b = Number(b);
  if (isNaN(a) || isNaN(b)) throw new Error(isNaN(a) ? `a: ${a} isNaN` :  `b: ${b} isNaN`)

  if (a < b) {
    if (b === 0) return 0
    return (b - a)
  } else {
    if (a === 0) return 0
    return -(a - b)
  }
};

/**
 * static list of categories set in contract
 */
const staticCategories = [
  { name: 'crypto', id: 0 }
];

/**
 * static list of styles set in contract
 */
const staticStyles = [
  { name: 'classic', fee: 4, id: 0 }
];

const contract = new Contract(DynastyContestsProxy, contestsABI, provider);

const getSavedCompetitions = async () => {
  try {
    const saves = await storage.get('competitions/competitions');
    return saves
  } catch {
    return []
  }
  
};

const getSavedCategories = async () => {
  try {
    const saves = await storage.get('competitions/categories');
    return saves
  } catch {
    return []
  }
  
};

const getSavedStyles = async () => {
  try {
    const saves = await storage.get('competitions/styles');
    return saves
  } catch {
    return []
  }
  
};

const JSONToBuffer =(json) => {
  return Buffer.from(JSON.stringify(json))
};
/**
 * Fetches all competitions
 *
 * Competitions are fetched at once in a queue (max 12 each run)
 */
var competitions$1 = async () => {
  // todo: don't fetch last years competitions

  const [categories, styles, competitions] = await Promise.all([getSavedCategories, getSavedStyles, getSavedCompetitions]);
  

  let data = {
    open: [],
    live: [],
    closed: [],
    names: [],
    openNames: [],
    liveNames: [],
    competitions: [],
    categories: {}
  };

  if (categories.length !== staticCategories.length) await storage.put('competitions/categories', JSONToBuffer(staticCategories));
  if (styles.length !== staticStyles.length) await storage.put('competitions/styles', JSONToBuffer(staticStyles));

    for (let category = 0; category < staticCategories.length; category++) {
      for (let style = 0; style < staticStyles.length; style++) {

        let fetchedCompetitions = await contract.competitionsByCategoryAndStyle(category, style);

        if (fetchedCompetitions.length > 0) {
          if (!data.categories[staticCategories[category].name]) data.categories[staticCategories[category].name] = [];

          data.categories[staticCategories[category].name].push({
            name: staticStyles[style].name,
            fee: staticStyles[style].fee,
            id: style
          });
          await storage.put('/competitions/categories', JSONToBuffer([data.categories]));
        }

        fetchedCompetitions = fetchedCompetitions.map(competition => {

          const time = new Date().getTime();
          const liveTime = Number(competition.liveTime.toString()) * 1000;
          const endTime = Number(competition.endTime.toString()) * 1000;
          const isLive = time > liveTime && time < endTime;
          
          if (competition.endTime.toString() === '0') return

          competition =  {
            style: style,
            category: category,
            id: competition.id.toNumber(),
            endTime,
            liveTime,
            price: utils.formatUnits(competition.price, 8),
            portfolioSize: competition.portfolioSize.toNumber(),
            participants: competition.members.length,
            extraData: competition.extraData !== '0x' ? JSON.parse(Buffer.from(competition.extraData.replace('0x', ''), 'hex').toString()) : {},
            name: competition.name,
            startTime: Number(competition.startTime.toNumber() * 1000).toString(),
            prizePool: utils.formatUnits(competition.prizePool, 8),      
            members: competition.members,
            state: competition.state,
            isLive
          };

          if (competition.state === 0 && endTime > time) {
            if (isLive) {
              data.liveNames.indexOf(competition.name) === -1 && data.liveNames.push(competition.name);
              data.live.push(competition);
            } else {        
              data.openNames.indexOf(competition.name) === -1 && data.openNames.push(competition.name);
              data.open.push(competition);
            }
          } else {
            data.closed.push(competition);
          }

          data.names.indexOf(competition.name) === -1 && data.names.push(competition.name);
    
          return competition
        });
        data.competitions = [...data.competitions, ...fetchedCompetitions];
      }
    }
  // }



  await storage.put('/competitions/open', JSONToBuffer(data.open));
  await storage.put('/competitions/closed', JSONToBuffer(data.closed));
  await storage.put('/competitions/live', JSONToBuffer(data.live));
  await storage.put('/competitions/names', JSONToBuffer(data.names));
  await storage.put('/competitions/open-names', JSONToBuffer(data.openNames));
  await storage.put('/competitions/live-names', JSONToBuffer(data.liveNames));
  await storage.put('/competitions/competitions', JSONToBuffer(data.competitions));
  return data
};

var competitions = async () => {
  console.time('competitions');
  await competitions$1();
  console.timeEnd('competitions');  
};

const twenfyFourHours = (24 * 60) * 60000;
const twelveHours = (12 * 60) * 60000;
const oneHour = 60 * 60000;

const currencyJob = async (timestamp, currency) => {

  let stampsOneHoursAgo = currency.timestamps.filter(stamp => {
    return timestamp - stamp > oneHour
  });

  stampsOneHoursAgo = stampsOneHoursAgo.sort((a, b) => b - a);

  if (stampsOneHoursAgo.length === 0 || timestamp - stampsOneHoursAgo[0] < oneHour) {
    delete currency.timestamps;
    return currency
  }

  let stampsTwelveHoursAgo = currency.timestamps.filter(stamp => {
    const time = timestamp - stamp;
    return time > twelveHours && time
  });

  stampsTwelveHoursAgo = stampsTwelveHoursAgo.sort((a, b) => b - a);

  let stampsTwentyFourHoursAgo = currency.timestamps.filter(stamp => {
    const time = timestamp - stamp;
    return time > twenfyFourHours && time
  });

  stampsTwentyFourHoursAgo = stampsTwentyFourHoursAgo.sort((a, b) => b - a);

  let points = 0;

  if (stampsTwentyFourHoursAgo.length > 0) {
    const stamp = stampsTwentyFourHoursAgo[0];
    let data = await storage.get(`currencies/${currency.id}/${stamp}`);
    data = JSON.parse(data.toString());
    if (data.volumeChange24hPercentage !== undefined) {
      points = await calculateFantasyPoints({
        priceDifference: data.priceChange24hPercentage || 0,
        volumeDifference: data.volumeChange24hPercentage || 0,
        marketCapDifference: data.rankChange24h || 0
      });
    }
  }

  currency.points = points;

  if (stampsTwentyFourHoursAgo.length > 0) {
    const stamp = stampsTwentyFourHoursAgo[0];
    let data = await storage.get(`currencies/${currency.id}/${stamp}`);
    data = JSON.parse(data.toString());

    currency.volumeChange24hPercentage = calculateDifference(data.volume, currency.volume);
    currency.rankChange24hPercentage = calculateDifference(data.rank, currency.rank);
    currency.rankChange24h = difference(data.rank, currency.rank);
    currency.priceChange24h = difference(data.price, currency.price);

    if (!isNaN(data.points)) {
      currency.pointsChange24hPercentage = calculateDifference(data.points, currency.points);
      currency.pointsChange24h = difference(data.points, points);
    }
  }

  if (stampsTwelveHoursAgo.length > 0) {
    const stamp = stampsTwelveHoursAgo[0];
    let data = await storage.get(`currencies/${currency.id}/${stamp}`);
    data = JSON.parse(data.toString());

    currency.priceChange12hPercentage = calculateDifference(data.price, currency.price);
    currency.volumeChange12hPercentage = calculateDifference(data.volume, currency.volume);
    currency.rankChange12hPercentage = calculateDifference(data.rank, currency.rank);
    currency.marketCapChange12hPercentage = calculateDifference(data.marketCap, currency.marketCap);

    currency.priceChange12h = difference(data.price, currency.price);
    currency.rankChange12h = difference(data.rank, currency.rank);

    if (!isNaN(data.points)) {
      currency.pointsChange12hPercentage = calculateDifference(data.points, points);
      currency.pointsChange12h = difference(data.points, points);
    }
  }

  if (stampsOneHoursAgo.length > 0) {
    const stamp = stampsOneHoursAgo[0];
    let data = await storage.get(`currencies/${currency.id}/${stamp}`);
    data = JSON.parse(data.toString());

    currency.priceChange1hPercentage = calculateDifference(data.price, currency.price);
    currency.volumeChange1hPercentage = calculateDifference(data.volume, currency.volume);
    currency.rankChange1hPercentage = calculateDifference(data.rank, currency.rank);
    currency.marketCapChange1hPercentage = calculateDifference(data.marketCap, currency.marketCap);
    currency.priceChange1h = difference(data.price, currency.price);
    currency.rankChange1h = difference(data.rank, currency.rank);

    if (!isNaN(data.points)) {
      currency.pointsChange1hPercentage = calculateDifference(data.points, points);
      currency.pointsChange1h = difference(data.points, points);
    }
  }
  
  delete currency.timestamps;
  delete currency.salary;

  await storage.put(`currencies/${currency.id}/${timestamp}`, Buffer.from(JSON.stringify(currency)));
  return currency
};

const timestampJob = async currency => {
  const timestamps = await storage.readDir(`currencies/${currency.id}`);
  currency.timestamps = timestamps.map(stamp => stamp.split('.data')[0]);
  return currency
};

var history = async () => {
  let currencies = cache.get('_marketdata');
  const timestamp = new Date().getTime();
  const set = {
    added: [],
    has: []
  };

  await Promise.all(currencies.map(async (currency, i) => {
    const has = await storage.hasDir(`currencies/${currency.id}`);
    if (has) set.has.push(currency);
    else set.added.push(currency);
  }));

  const stamps = await Promise.all(set.has.map(currency => timestampJob(currency)));

  currencies = await Promise.all(stamps.map(currency => currencyJob(timestamp, currency)));

  await Promise.all(set.added.map(currency => storage.put(`currencies/${currency.id}/${timestamp}`, Buffer.from(JSON.stringify(currency)))));

  cache.add('marketdata', [...currencies, ...set.added]);
};

// import firebase from './../firebase'
// import 'dotenv/config'

class JobRunner {
  constructor() {
    this.#init();
  }

  async #init() {
    const job = async () => {
      await marketdata();
      await history();
    };

    await job();
    // every hour
    cron.schedule('0 */1 * * *', job);
    // every 5 minutes
    await competitions();
    cron.schedule('*/1 * * * *', competitions);      
  }
}

const router$2 = new Router();

router$2.get('/styles', async ctx => ctx.body = (await storage.get('/competitions/styles')).toString());

router$2.get('/categories', async ctx => ctx.body = (await storage.get('/competitions/categories')).toString());

router$2.get('/open-competition-names', async ctx => ctx.body = (await storage.get('/competitions/categories')).toString());

router$2.get('/live-competition-names', async ctx => ctx.body = (await storage.get('/competitions/categories')).toString());

router$2.get('/competition-names', async ctx => ctx.body = (await storage.get('/competitions/names')).toString());

const router$1 = new Router();

router$1.get('/portfolio-points', async ctx => {
  let {portfolio} = ctx.request.query;
  portfolio = portfolio.split(',');
  let stamps = await Promise.all(portfolio.map(id => storage.readDir(`currencies/${id}`)));  
  let points = await Promise.all(portfolio.map(async (id, i) => {
    stamps[i] = stamps[i].map(stamp => stamp.split('.data')[0]);

    stamps[i] = stamps[i].sort((a, b) => b - a);
    return (JSON.parse((await storage.get(`currencies/${id}/${stamps[i][0]}`)).toString())).points
  }));

  const total = points.reduce((prev, curr) => {
    return prev + curr
  }, 0);

  ctx.body = {points, total};
});

const PortfolioEdit = {
    PortfolioEdit: [
      { name: 'type', type: 'string' },
      { name: 'category', type: 'uint256' },
      { name: 'style', type: 'uint256' },
      { name: 'id', type: 'uint256' },
      { name: 'value', type: 'string[]' }
  ]
};

const AccountEdit = {
  Link: [
    { name: 'name', type: 'string' },
    { name: 'value', type: 'string' },
  ],
  AccountEdit: [
    { name: 'type', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'avatar', type: 'string' },
    { name: 'links', type: 'Link[]'}
  ]
};

var types = {
  PortfolioEdit,
  AccountEdit
};

const router = new Router();

const domain = {
  name: 'Dynasty Games',
  version: '1',
  // chainId: 1,
  // verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

router.get('/account', async ctx => {
  let {address} = ctx.request.query;
  const avatar = multiavatar(address);
  ctx.body = {avatar};
});

router.get('/account/avatar', async ctx => {
  let {address} = ctx.request.query;
  ctx.body = multiavatar(address);
});

router.put('/account/portfolio', async ctx => {
  let {address, portfolio, id, style, category, signature } = ctx.request.query;
  const message = {
    type: 'PortfolioEdit',
    value: portfolio.split(','),
    category: Number(category),
    style: Number(style),
    id: Number(id)
  };
  const signerAddr = await ethers.utils.verifyTypedData(domain, types['PortfolioEdit'], message, signature);

  if (signerAddr === address) {
    
  // todo: signature valid?
    await storage.put(`/portfolios/${address}/${id}`, Buffer.from(portfolio));
    ctx.response.status = 200;
  } else {
    ctx.response.status = 401;
  }
});

router.get('/account/portfolio', async ctx => {
  let {address, competitionId } = ctx.request.query;
  const portfolio = await storage.get(`/portfolios/${address}/${competitionId}`);
  ctx.body = portfolio.toString().split(',');
});

class DynastyStorageClient {  
  #port
  #client

  constructor(port = 6000, algorithm = 'sha256') {
    this.#port = port;
    this.algorithm = algorithm;
    this.algorithmBuffer = Buffer.from(algorithm);
    this.algorithmPrefixLength = this.algorithmBuffer.length;
    return this.#init()
  }

  async #init() {
    this.#client = await client(`ws://localhost:${this.#port}`, 'dynasty-data-storage-v1.0.0', {retry: true});
    return this
  }

  #request(url, key, value) {
    return this.#client.request({
      url,
      params: {
        key,
        value
      }
    })
  }

  async put(key, value) {
    return this.#request('put', key, value.toString('hex'))    
  }

  async get(key) {
    const data = await this.#request('get', key);
    return Buffer.from(data, 'hex')
  }

  async delete(key) {
    return this.#request('delete', key)
  }

  async has(key) {
    const has = await this.#request('has', key);
    return has === 'true' ? true : false
  }

  async hasDir(key) {
    const has = await this.#request('hasDir', key);
    return has === 'true' ? true : false
  }

  async readDir(key) {
    const files = await this.#request('readDir', key);
    return files
  }

  async query(key = {}) {
    const data = await this.#request('query', key);
    return data
  }

  async queryKeys(key = {}) {
    const data = await this.#request('queryKeys', key);
    return data
  }
}

globalThis.storage = await new DynastyStorageClient();

new JobRunner();
const server = new Koa();

server
  .use(cors({ origin: '*' }))
  .use(router$5.routes())
  .use(router$3.routes())
  .use(router$4.routes())
  .use(router$2.routes())
  .use(router$1.routes())
  .use(router.routes())
  .use(router$5.allowedMethods());

server.listen(8668);
