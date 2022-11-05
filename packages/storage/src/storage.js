import { homedir } from 'os'
import { join, parse, posix, win32 } from 'path';
import { Key } from 'interface-datastore'
import base32 from '@vandeurenglenn/base32';
import { stat } from 'node:fs/promises';
import {
  MemoryDatastore,
  ShardingDatastore,
  TieredDatastore
} from './../node_modules/datastore-core/esm/src/index'

import { NextToLast } from './../node_modules/datastore-core/esm/src/shard';
import { FsDatastore } from './../node_modules/datastore-fs/esm/src/index'
import { createHash } from 'crypto';
import { mkdirSync } from 'fs';
import { access } from 'fs/promises';
import { constants } from 'fs';
import globby from 'globby';
import queue from '@vandeurenglenn/queue'


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
      this.#cleanupMemory()
      this.#cleanupStorage()
      return this
    }

    #cleanupMemory() {
      setTimeout(() => {
        console.time('clean memoryStore')
        let keys = Object.keys(memoryStore.data)
        keys = keys.reduce((set, path) => {
          const parts = path.split(/([^\/]+)$/)
          set[parts[0]] = set[parts[0]] || []
          set[parts[0]].push(Number(parts[1]))
          return set
        }, {})        
        const time = new Date().getTime()
        let deletions = 0
        
        for (const i of Object.keys(keys)) {
          keys[i] = keys[i].sort((a, b) => b - a)
          keys[i] = keys[i].filter(stamp => stamp + (3600000 * 48) < time)
          keys[i].forEach(stamp => {
            deletions += 1
            delete memoryStore[`${i}/${stamp}`]
          })
        }
        console.timeEnd('clean memoryStore')
        console.log(`removed ${deletions} paths`); 
        this.#cleanupMemory()
      }, 10 * 60000)
    }

    #cleanupStorage() {
      setTimeout(async () => {
        console.time('clean Storage')

        const time = new Date().getTime()
        
        let paths = await this.readDir('currencies')
        paths = paths.filter(path => {
          // 1 year and 24h
          return Number(path.split(posix.sep)[1].split('.data')[0]) + (8790 * 3.6e+6) < time
        })
        
        const sizes = await Promise.all(paths.map(path => stat(join(homedir(), '.dynasty/data/currencies', path))))
        const totalSize = sizes.reduce((totalSize, {size}) => {
          totalSize += size
          return totalSize
        }, 0)

        try {          
          await queue({}, paths.map(path => join('currencies', path.replace('.data', ''))), this.delete.bind(this), 5000)
        } catch(e) {
          console.error(e);
        }
        console.timeEnd('clean Storage')
        console.log(`  removed ${paths.length} items \n  freed ${totalSize * 1e-6} Mb`); 
        this.#cleanupStorage()
      }, 10 * 60000)
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
      return new Key(key)
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
      return store.has(this.createKey(key))
    }
    
    async hasDir(path) {      
      try {
        await access(join(homedir(), '.dynasty/data', path), constants.R_OK | constants.W_OK);
        return true
      } catch (e) {
        return false        
      }
    }

    async readDir(path) {
      const root = join(homedir(), '.dynasty/data', path)
      path = root.split(win32.sep)
      path = path.join(posix.sep)
      const files = await globby(path);

      return files.map(file => file.split(path + posix.sep)[1])
    }

    async query(key = {}) {
      const data = []
      console.log(store.queryKeys(key));
      for await (const _key of store.queryKeys({})) {
        data.push(_key)
      }
      console.log({data});
      return data
    }

    async queryKeys(key = {}) {
      return store.queryKeys(this.createKey(key))
    }
}
