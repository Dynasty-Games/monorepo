import addresses from './../node_modules/@dynasty-games/addresses/goerli'
import { readFile, writeFile} from 'fs'
import { promisify } from 'util'
import { getDefaultProvider, Contract, utils, providers, Wallet } from 'ethers'
import ContestABI from './../node_modules/@dynasty-games/abis/DynastyContest-ABI.json'
import CompetitionABI from './../node_modules/@dynasty-games/abis/Competition-ABI.json'

import './firebase'
import {create, close, rankings} from './tasks/tasks.js'
import {config} from './contracts'

const login = () => firebase.signInWithEmailAndPassword(firebase.auth, config.EMAIL, config.PASSWORD);


// firebase.onAuthStateChanged(firebase.auth, (user) => {
//   if (user) {
//     // const uid = user.uid;
//   } else {
//     // login again if logged out due to network etc
//     login()
//   }
// });

(async () => {
  // await login()
  const tasks = [create(), close(), rankings()]
  //await tasks[1].job() // try closing on each start
tasks[0].job()
  for (const task of tasks) {
    task.runner.start()
  }




  // rankings().start()

})()
