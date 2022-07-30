'use strict';

var Koa = require('koa');
var cors = require('@koa/cors');
var Router = require('@koa/router');
var fetch = require('node-fetch');
var ethers = require('ethers');
require('@dynasty-games/addresses/goerli.json');
require('@dynasty-games/abis/DynastyContest-ABI.json');
require('express');
require('dotenv/config');
var lib = require('@dynasty-games/lib');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

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

var FakeUSDC$1 = "0xab5417222849D9bF8F55059502E86bDDdb496fB5";
var DynastyTreasury = "0xE7C5B5Cd9DF18281C043084A4dF872d942C2af33";
var DynastyContests = "0xABb9114368cdf817CE5F1de7239CA392b8A8D086";
var RLPReader = "0x193481aDcd1223c80105c5431A9028b49B7D99a4";
var MerklePatriciaProof = "0xc7D9c2A86e23dB3eAd63A731c0a39890Ba64207E";
var Merkle = "0x05DB74e048b48E98e04cA0cc6eA2ABe3d7De2744";
var ExitPayloadReader = "0x43126E5EC8738658723d1Fa3cA1cA4C14Fa4d8C6";
var FxStateRootTunnel = "0xf4C2893E33bA5f84CCc66B6775a4AaB1Ab06020b";
var addresses = {
	FakeUSDC: FakeUSDC$1,
	DynastyTreasury: DynastyTreasury,
	DynastyContests: DynastyContests,
	RLPReader: RLPReader,
	MerklePatriciaProof: MerklePatriciaProof,
	Merkle: Merkle,
	ExitPayloadReader: ExitPayloadReader,
	FxStateRootTunnel: FxStateRootTunnel
};

var contestsABI = [
	{
		inputs: [
			{
				internalType: "string",
				name: "uri_",
				type: "string"
			}
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
				name: "account",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "ApprovalForAll",
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
		name: "CategoryChange",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "Paused",
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
		name: "TokenAdded",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
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
				internalType: "uint256[]",
				name: "ids",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "values",
				type: "uint256[]"
			}
		],
		name: "TransferBatch",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
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
				name: "id",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "TransferSingle",
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
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "string",
				name: "value",
				type: "string"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "id",
				type: "uint256"
			}
		],
		name: "URI",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "Unpaused",
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
				name: "name",
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
				name: "name",
				type: "string"
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
			{
				internalType: "uint256",
				name: "id",
				type: "uint256"
			},
			{
				internalType: "string",
				name: "name",
				type: "string"
			}
		],
		name: "addToken",
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
				name: "id",
				type: "uint256"
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
				internalType: "address[]",
				name: "accounts",
				type: "address[]"
			},
			{
				internalType: "uint256[]",
				name: "ids",
				type: "uint256[]"
			}
		],
		name: "balanceOfBatch",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
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
				internalType: "uint256[]",
				name: "competitionIds_",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "address[]",
				name: "members_",
				type: "address[]"
			},
			{
				internalType: "uint256",
				name: "tokenId_",
				type: "uint256"
			}
		],
		name: "closeCompetitionBatch",
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
						internalType: "enum DynastyContests.States",
						name: "state",
						type: "uint8"
					}
				],
				internalType: "struct DynastyContests.Competition",
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
				internalType: "enum DynastyContests.States",
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
						internalType: "enum DynastyContests.States",
						name: "state",
						type: "uint8"
					}
				],
				internalType: "struct DynastyContests.Competition[]",
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
			{
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				internalType: "address",
				name: "operator",
				type: "address"
			}
		],
		name: "isApprovedForAll",
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
				internalType: "struct DynastyContests.Portfolio",
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
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "id",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
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
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "ids",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "mintBatch",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "pause",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "paused",
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
				internalType: "uint256",
				name: "category_",
				type: "uint256"
			},
			{
				internalType: "string",
				name: "name",
				type: "string"
			}
		],
		name: "replaceCategory",
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
				name: "name",
				type: "string"
			}
		],
		name: "replacestyle",
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
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "ids",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "safeBatchTransferFrom",
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
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "id",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "setApprovalForAll",
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
			},
			{
				internalType: "string",
				name: "uri",
				type: "string"
			}
		],
		name: "setURI",
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
		name: "setURI",
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
				name: "id",
				type: "uint256"
			}
		],
		name: "style",
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
				name: "competitionId",
				type: "uint256"
			},
			{
				internalType: "string[]",
				name: "items",
				type: "string[]"
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
		name: "tokens",
		outputs: [
			{
				internalType: "string[]",
				name: "",
				type: "string[]"
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
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "id",
				type: "uint256"
			}
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
		],
		name: "unpause",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "uri",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

const network$1 = ethers.providers.getNetwork('goerli');

var provider$1 = ethers.getDefaultProvider(network$1, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
});

const contract$1 = new ethers.Contract(DynastyContests, contestsABI, provider$1);

const job = async ({category, style, id}, data) => {
  const state = await contract$1.competitionState(category, style, id);
  const params = await contract$1.competition(category, style, id);
  const participants = await contract$1.totalMembers(category, style, id);
  const time = new Date().getTime();
  const liveTime = Number(params.liveTime.toString()) * 1000;
  const endTime = Number(params.endTime.toString()) * 1000;

  const isLive = time > liveTime && time < endTime;
  if (params.endTime.toString() === '0') return
  
  const competition = {
    style,
    category,
    id: params.id.toNumber(),
    endTime,
    liveTime,
    price: ethers.utils.formatUnits(params.price, 0),
    portfolioSize: params.portfolioSize.toNumber(),
    participants: participants.toNumber(),
    name: params.name,
    startTime: Number(params.startTime.toNumber() * 1000).toString(),
    prizePool: ethers.utils.formatUnits(params.prizePool, 0),
    state,
    isLive
  };

  if (state === 0) {
    if (isLive) {
      data.live.push(competition);
    } else {
      data.open.push(competition);
    }
    
  } else {
    data.closed.push(competition);
  }
  return data
};

const _runQueue = (competitions, data, job) => Promise.all(competitions.map(competition => job(competition, data)));

const runQueue = async (data, queue, job) => {
  await _runQueue(queue.splice(0, queue.length > 12 ? 12 : queue.length), data, job);
  if (queue.length > 0) return runQueue(data, queue, job)
};

const totalCompetitions = async ({category, style}, data) => {
  const totalCompetitions = await contract$1.totalCompetitions(category, style);
  data.push({
    totalCompetitions: totalCompetitions.toNumber(),
    category,
    style
  });
  return data
};

/**
 * Fetches all competitions
 * 
 * Competitions are fetched at once in a queue (max 12 each run)
 */
var competitions$1 = async () => {
  // todo: don't fetch last years competitions
  const categoriesLength = await contract$1.categoriesLength();
  const stylesLength = await contract$1.stylesLength();

  let queue = [];
  
  for (let category = 0; category < categoriesLength; category++) {
    for (let style = 0; style < stylesLength; style++) {
      queue.push({category, style});
    }
  }

  let data = [];

  await runQueue(data, queue, totalCompetitions);

  queue = [];
  for (let i = 0; i < data.length; i++) {
    const totalCompetitions = data[i].totalCompetitions;
    const category = data[i].category;
    const style = data[i].style;

    for (let id = 0; id < totalCompetitions; id++) { 
      queue.push({category, style, id: totalCompetitions - id});
    }    
  }

  data = {
    open: [],
    live: [],
    closed: []
  };

  await runQueue(data, queue, job);
  return data
};

const router$1 = new Router__default["default"]();

const filter = ctx => {
  
  const { category, style, id } = ctx.request.query;
  if (category && style && id) {
    ctx.body = ctx.body.filter(item => item.category === Number(category) && item.style === Number(style) && item.id === Number(id));
    return ctx.body
  }

  if (category && id) {
    ctx.body = ctx.body.filter(item => item.category === Number(category) && item.id === Number(id));
    return ctx.body
  }

  if (style && id) {
    ctx.body = ctx.body.filter(item => item.id === Number(id) && item.style === Number(style));
    return ctx.body
  }

  if (category && style) {
    ctx.body = ctx.body.filter(item => item.category === Number(category) && item.style === Number(style));
    return ctx.body
  }

  if (category) {
    ctx.body = ctx.body.filter(item => item.category === Number(category));
    return ctx.body
  }

  if (style) {
    ctx.body = ctx.body.filter(item => item.style === Number(style));
    return ctx.body
  }
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
router$1.get('/competitions', async ctx => {
  let data = cache.get('competitions');
  if (data) ctx.body = [...data.live, ...data.open, ...data.closed];
  else {
    data = await competitions$1();
    cache.add('competitions', data);
    ctx.body = [...data.live, ...data.open, ...data.closed];
  }
  filter(ctx);
});

router$1.get('/open-competitions', async ctx => {
  let data = cache.get('competitions');
  if (data) ctx.body = data.open;
  else {
    data = await competitions$1();
    cache.add('competitions', data);
    ctx.body = data.open;
  }
  filter(ctx);
});

router$1.get('/closed-competitions', async ctx => {
  let data = cache.get('competitions');
  if (data) ctx.body = data.closed;
  else {
    data = await competitions$1();
    cache.add('competitions', data);
    ctx.body = data.closed;
  }
  filter(ctx);
});

router$1.get('/live-competitions', async ctx => {
  let data = cache.get('competitions');
  if (data) ctx.body = data.live;
  else {
    data = await competitions$1();
    cache.add('competitions', data);
    ctx.body = data.live;
  }
  filter(ctx);
});

var FakeUSDC = [
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

const contract = new ethers.Contract(addresses.FakeUSDC, FakeUSDC, signer);

const timedOutMessage = ctx => {
  ctx.body = `${ctx.request.query.address} on timeout till ${new Date(timedOut[ctx.request.query.address] + 43200 * 1000)}`;
};

router.get('/faucet', async ctx => {
  try {
    if (timedOut[ctx.request.query.address] + 43200 < Math.round(new Date().getTime() / 1000)) return timedOutMessage(ctx)
    let tx = await contract.mint(ctx.request.query.address, ethers.utils.parseUnits('100', 8));
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
      address: addresses.FakeUSDC
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
