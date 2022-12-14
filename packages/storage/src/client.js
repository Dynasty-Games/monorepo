import client from 'socket-request-client'

export default class DynastyStorageClient {  
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
    await this.#initClient()
    return this
  }

  async #initClient() {
    this.#client = await client(`ws://localhost:${this.#port}`, 'dynasty-data-storage-v1.0.0', {retry: true, timeout: 10_000, times: 10});
  }

  async #beforeRequest() {
    if (this.#client.connectionState() !== 'open') await this.#initClient()
  }

  async #request(url, key, value) {
    await this.#beforeRequest()
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
    const has = await this.#request('has', key)
    return has === 'true' ? true : false
  }

  async hasDir(key) {
    const has = await this.#request('hasDir', key)
    return has === 'true' ? true : false
  }

  async readDir(key) {
    const files = await this.#request('readDir', key)
    return files
  }

  async query(key = {}) {
    const data = await this.#request('query', key)
    return data
  }

  async queryKeys(key = {}) {
    const data = await this.#request('queryKeys', key)
    return data
  }
}
