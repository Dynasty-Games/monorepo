import marketdata from './marketdata'
import competitions from './competitions'
import history from './history'
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
    cron.schedule('*/5 * * * *', competitions)      
  }
}
