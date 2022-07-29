import { homedir } from 'os'
import { join } from 'path';
import { Key } from 'interface-datastore'
import base32 from '@vandeurenglenn/base32';
import {
  MemoryDatastore,
  ShardingDatastore,
  TieredDatastore
} from './../node_modules/datastore-core/esm/src/index'

import { NextToLast } from './../node_modules/datastore-core/esm/src/shard';
import { FsDatastore } from './../node_modules/datastore-fs/esm/src/index'
import { createHash } from 'crypto';
import { mkdirSync } from 'fs';


try {
  mkdirSync(join(homedir(), '.dynasty/data'))
} catch {
  // ignore
}

const store = new FsDatastore(join(homedir(), '.dynasty/data'))
const memoryStore = new MemoryDatastore()
// const dataStore = new ShardingDatastore(store, new NextToLast(2))
const stores = new TieredDatastore([memoryStore, store])


export default class DynastyStorage {

    constructor(algorithm = 'sha256') {
      this.algorithm = algorithm
      this.algorithmBuffer = Buffer.from(algorithm)
      this.algorithmPrefixLength = this.algorithmBuffer.length
      return this.#init()
    }

    async #init() {
      await stores.open()
      return this
    }

    createHash(key) {
      const hasher = createHash(this.algorithm)
      const paths = key.split('/')
      hasher.update(paths.splice(paths.length - 1, 1)[0])
      const buffer = Buffer.concat([
        this.algorithmBuffer,
        hasher.digest()
      ])
      paths.push(base32.encode(buffer))      
      return paths.join('/')
    }

    createKey(key) {
      return new Key(this.createHash(key))
    }

    async put(key, value) {
      return stores.put(this.createKey(key), value)
    }

    async get(key) {
      return stores.get(this.createKey(key))
    }

    async delete(key) {
      return stores.delete(this.createKey(key))
    }

    async has(key) {
      return stores.delete(this.createKey(key))
    }
}
