'use strict';

var Koa = require('koa');
var cors = require('@koa/cors');
var Router = require('@koa/router');
var fetch = require('node-fetch');
var ethers = require('ethers');
require('dotenv/config');
var client = require('socket-request-client');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var client__default = /*#__PURE__*/_interopDefaultLegacy(client);

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
    data = data.filter(currency => currency.marketCap > Number(ctx.query.marketcap));
  }
  ctx.body = data;
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
var DynastyContests = "0x1674c58a159f28F69d701AF29A99312553Cb7B85";
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
	FakeUSDC: FakeUSDC$1,
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

const network$1 = ethers.providers.getNetwork('goerli');

var provider$1 = ethers.getDefaultProvider(network$1, {
  alchemy: 'dy2iwSy4JxajO73gfBXYdpWILHX2wWCI',
  infura: '1ca30fe698514cf19a5e3e5e5c8334a8',
  pocket: '62ac464b123e6f003975253b',
  etherscan: '6XI8Q8NA96JFB71WA8VV9TM42K8H4DVIBN'
});

const _runQueue = (items, data, job) => Promise.all(items.map(item => job(item, data)));

const runQueue = async (data, queue, job) => {
  await _runQueue(queue.splice(0, queue.length > 12 ? 12 : queue.length), data, job);
  if (queue.length > 0) return runQueue(data, queue, job)
};

const contract$1 = new ethers.Contract(DynastyContestsProxy, contestsABI, provider$1);

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
    price: ethers.utils.formatUnits(params.price, 8),
    portfolioSize: params.portfolioSize.toNumber(),
    participants: participants.toNumber(),
    name: params.name,
    startTime: Number(params.startTime.toNumber() * 1000).toString(),
    prizePool: ethers.utils.formatUnits(params.prizePool, 0),
    state,
    isLive
  };

  if (state === 0 && endTime > time) {
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

    for (let id = 0; id <= totalCompetitions; id++) { 
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
  let data = await getMarketData('usd', '250', '2');
  data = data.map(({
    name, id, symbol, image, current_price, total_supply, salary,
    total_volume, market_cap_rank, circulating_supply,
    price_change_percentage_24h, roi, market_cap,
    market_cap_change_percentage_24h, max_supply
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
};

var competitions = async () => {
  const data = await competitions$1();
  cache.add('competitions', data);
};

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
      fantasyPoints -= (marketCapDifference / 50);
    } else {
      fantasyPoints += (marketCapDifference * 25);
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

  if (a < b) {
    if (b === 0) return 0
    return ((b - a) / b) * 100
  } else {
    if (a === 0) return 0
    return -(((a - b) / a) * 100)
  }
};

const twenfyFourHours = (24 * 60) * 60000;
const twelveHours = (12 * 60) * 60000;
const oneHour = 60 * 60000;

const currencyJob = async (timestamp, currency) => {

  let stampsOneHoursAgo = currency.timestamps.filter(stamp => {
    return timestamp - stamp > oneHour
  });

  stampsOneHoursAgo = stampsOneHoursAgo.sort((a, b) => a - b);

  if (stampsOneHoursAgo[stampsOneHoursAgo.length - 1] + oneHour < timestamp || stampsOneHoursAgo.length === 0) return currency;

  let stampsTwelveHoursAgo = currency.timestamps.filter(stamp => {
    return timestamp - stamp > twelveHours
  });

  stampsTwelveHoursAgo = stampsTwelveHoursAgo.sort((a, b) => a - b);

  let stampsTwentyFourHoursAgo = currency.timestamps.filter(stamp => {
    return timestamp - stamp > twenfyFourHours
  });

  stampsTwentyFourHoursAgo = stampsTwentyFourHoursAgo.sort((a, b) => a - b);

  let points = 0;

  if (stampsTwentyFourHoursAgo.length > 0) {
    const stamp = stampsTwentyFourHoursAgo[stampsTwentyFourHoursAgo.length - 1];
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
    const stamp = stampsTwentyFourHoursAgo[stampsTwentyFourHoursAgo.length - 1];
    let data = await storage.get(`currencies/${currency.id}/${stamp}`);
    data = JSON.parse(data.toString());
    console.log(data);
    
    currency.volumeChange24hPercentage = calculateDifference(data.volume, currency.volume);
    currency.rankChange24hPercentage = calculateDifference(data.rank, currency.rank);    
    currency.rankChange24h = Number(data.rank) - Number(currency.rank);
    currency.priceChange24h = Number(data.price) - Number(currency.price);

    if (data.points) {
      currency.pointsChange24hPercentage = calculateDifference(data.points, currency.points);  
      currency.pointsChange24h = Number(data.points) - Number(points);
    }
  }

  if (stampsTwelveHoursAgo.length > 0) {
    const stamp = stampsTwelveHoursAgo[stampsTwelveHoursAgo.length - 1];
    let data = await storage.get(`currencies/${currency.id}/${stamp}`);
    data = JSON.parse(data.toString());

    currency.priceChange12hPercentage = calculateDifference(data.price, currency.price);
    currency.volumeChange12hPercentage = calculateDifference(data.volume, currency.volume);
    currency.rankChange12hPercentage = calculateDifference(data.rank, currency.rank);
    currency.marketCapChange12hPercentage = calculateDifference(data.marketCap, currency.marketCap);

    currency.priceChange12h = Number(data.price) - Number(currency.price);
    currency.rankChange12h = Number(data.rank) - Number(currency.rank);

    if (data.points) {
      currency.pointsChange12hPercentage = calculateDifference(data.points, points);      
      currency.pointsChange12h = Number(data.points) - Number(points);
    }    
  }

  if (stampsOneHoursAgo.length > 0) {
    const stamp = stampsOneHoursAgo[stampsOneHoursAgo.length - 1];
    let data = await storage.get(`currencies/${currency.id}/${stamp}`);
    data = JSON.parse(data.toString());
    
    currency.priceChange1hPercentage = calculateDifference(data.price, currency.price);
    currency.volumeChange1hPercentage = calculateDifference(data.volume, currency.volume);
    currency.rankChange1hPercentage = calculateDifference(data.rank, currency.rank);
    currency.marketCapChange1hPercentage = calculateDifference(data.marketCap, currency.marketCap);
    currency.priceChange1h = Number(data.price) - Number(currency.price);
    currency.rankChange1h = Number(data.rank) - Number(currency.rank);

    if (data.points) {
      currency.pointsChange1hPercentage = calculateDifference(data.points, points);  
      currency.pointsChange1h = Number(data.points) - Number(points);
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
    // 5 min timeout
    this.timeout = 5 * 60000;
    this.jobs = [
      marketdata,
      history,
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
    this.#client = await client__default["default"](`ws://localhost:${this.#port}`, 'dynasty-data-storage-v1.0.0', {retry: true});
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

(async () => {
  globalThis.storage = await new DynastyStorageClient();

  new JobRunner();
  const server = new Koa__default["default"]();
  
  server
    .use(cors__default["default"]({ origin: '*' }))
    .use(router$2.routes())
    .use(router.routes())
    .use(router$1.routes())
    .use(router$2.allowedMethods());
  
  server.listen(8668);
})();
