import server from 'socket-request-server'
import Storage from './storage'

export default class DynastyStorageServer {  
  #port
  #stores
  #server
  
  constructor(port = 6000, algorithm = 'sha256') {
    this.#port = port
    this.algorithm = algorithm
    this.algorithmBuffer = Buffer.from(algorithm)
    this.algorithmPrefixLength = this.algorithmBuffer.length
    return this.#init()
  }

  async #init() {
    this.#stores = await new Storage()
    this.#server = await server({protocol: 'dynasty-data-storage-v1.0.0', port: this.#port}, {
      get: this.#get.bind(this),
      put: this.#put.bind(this),
      delete: this.#delete.bind(this),
      has: this.#has.bind(this)
    });

    return this
  }

  async #put({key, value}, response) {
    try {
      await this.#stores.put(key, Buffer.from(value, 'hex'))
      
      response.send('ok')
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500)
    }
    return
  }

  async #get({key}, response) {
    try {
      const data = await this.#stores.get(key)
      response.send(data.toString('hex'))
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500)
    }
    return
  }

  async #delete({key}, response) {
    try {
      await this.#stores.delete(key)
      response.send('ok')
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500)
    }
    return
  }

  async #has({key}, response) {
    try {
      const has = await this.#stores.has(key)
      response.send(has || String(false))
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500)
    }
    return
  }
}
