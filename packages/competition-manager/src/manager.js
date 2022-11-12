import addresses from './../node_modules/@dynasty-games/addresses/goerli'
import { readFile, writeFile} from 'fs'
import { promisify } from 'util'
import { getDefaultProvider, Contract, utils, providers, Wallet } from 'ethers'
import ContestABI from './../node_modules/@dynasty-games/abis/DynastyContest-ABI.json'
import CompetitionABI from './../node_modules/@dynasty-games/abis/Competition-ABI.json'

import {create, close, rankings} from './tasks/tasks.js'
import {config} from './contracts';

import DynastyStorageClient from '../../storage/src/storage-client.js';

(async () => {
  globalThis.storage = await new DynastyStorageClient()
  // await login()
  const tasks = [create(), close(), rankings()]
  // await tasks[2].job() // try closing on each start
// await tasks[0].job()
  for (const task of tasks) {
    task.runner.start()
  }




  // rankings().start()

})()
