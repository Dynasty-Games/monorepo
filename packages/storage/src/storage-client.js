import client from 'socket-request-client'

export default class DynastyStorageServer {  
  #port
  #client

  constructor(port = 6000, algorithm = 'sha256') {
    this.#port = port
    this.algorithm = algorithm
    this.algorithmBuffer = Buffer.from(algorithm)
    this.algorithmPrefixLength = this.algorithmBuffer.length
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
    const data = await this.#request('get', key)
    return Buffer.from(data, 'hex')
  }

  async delete(key) {
    return this.#request('delete', key)
  }

  async has(key) {
    const has = this.#request('has', key)
    return has === 'true' ? true : false
  }
}
