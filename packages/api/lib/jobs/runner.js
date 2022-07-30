import marketdata from './marketdata'
import competitions from './competitions'
import history from './history'
// import firebase from './../firebase'
// import 'dotenv/config'

export default class JobRunner {
  constructor() {
    // 5 min timeout
    this.timeout = 5 * 60000
    this.jobs = [
      marketdata,
      history,
      competitions
    ]

    this.runJobs = this.runJobs.bind(this)

    this.#init()

  }

  async #init() {
    // await firbase.signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD)
    await this.runJobs()
  }
  // some need other jobs to be finished first so jobs are run sync
  async runJobs() {

    for (const job of this.jobs) {
      await job()
    }
    setTimeout(this.runJobs, this.timeout)
  }
}
