// import config from './config/config'
import Peernet from '@leofcoin/peernet'

export default class Node {
  constructor() {
    return this._init()
  }

  async _init(config = {
    network: 'leofcoin',
    root: '.dynasty',
    networkName: 'leofcoin:olivia', // connect to Leofcoin nodes to provide more cover (olivia = the testnet, main is just leofcoin)
    networkVersion: 'v0.1.0'
  }) {
    globalThis.Peernet ? await new globalThis.Peernet(config) : await new Peernet(config)
    return this
    // this.config = await config()
  }

}
