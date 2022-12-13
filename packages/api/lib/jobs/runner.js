import marketdata from './marketdata.js'
import competitions from './competitions.js'
import history from './history.js'
import cron from 'node-cron'

// import firebase from './../firebase'
// import 'dotenv/config'

export default class JobRunner {
  constructor() {
    this.#init()
  }

  async #init() {
    const job = async () => {
      await marketdata()
      await history()
    }

    await job()
    // every hour
    cron.schedule('0 */1 * * *', job)
    // every 5 minutes
    await competitions()
    cron.schedule('*/1 * * * *', competitions)      
  }
}
