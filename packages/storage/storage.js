'use strict';

var os = require('os');
var path = require('path');
var interfaceDatastore = require('interface-datastore');
var base32 = require('@vandeurenglenn/base32');
var promises = require('node:fs/promises');
var all = require('it-all');
var drain = require('it-drain');
var filter = require('it-filter');
var take = require('it-take');
var key = require('interface-datastore/key');
var errCode = require('err-code');
var map = require('it-map');
require('it-pipe');
require('it-merge');
var debug = require('debug');
var pushable = require('it-pushable');
var fs = require('fs');
var glob = require('it-glob');
var mkdirp = require('mkdirp');
var util = require('util');
var datastoreCore = require('datastore-core');
var parallel = require('it-parallel-batch');
var fwa = require('fast-write-atomic');
var crypto = require('crypto');
var promises$1 = require('fs/promises');
var globby = require('globby');
var queue = require('@vandeurenglenn/queue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var base32__default = /*#__PURE__*/_interopDefaultLegacy(base32);
var all__default = /*#__PURE__*/_interopDefaultLegacy(all);
var drain__default = /*#__PURE__*/_interopDefaultLegacy(drain);
var filter__default = /*#__PURE__*/_interopDefaultLegacy(filter);
var take__default = /*#__PURE__*/_interopDefaultLegacy(take);
var errCode__default = /*#__PURE__*/_interopDefaultLegacy(errCode);
var map__default = /*#__PURE__*/_interopDefaultLegacy(map);
var debug__default = /*#__PURE__*/_interopDefaultLegacy(debug);
var pushable__default = /*#__PURE__*/_interopDefaultLegacy(pushable);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var glob__default = /*#__PURE__*/_interopDefaultLegacy(glob);
var mkdirp__default = /*#__PURE__*/_interopDefaultLegacy(mkdirp);
var parallel__default = /*#__PURE__*/_interopDefaultLegacy(parallel);
var fwa__default = /*#__PURE__*/_interopDefaultLegacy(fwa);
var globby__default = /*#__PURE__*/_interopDefaultLegacy(globby);
var queue__default = /*#__PURE__*/_interopDefaultLegacy(queue);

const sortAll = (iterable, sorter) => {
  return async function* () {
    const values = await all__default["default"](iterable);
    yield* values.sort(sorter);
  }();
};

class BaseDatastore {
  open() {
    return Promise.reject(new Error('.open is not implemented'));
  }
  close() {
    return Promise.reject(new Error('.close is not implemented'));
  }
  put(key, val, options) {
    return Promise.reject(new Error('.put is not implemented'));
  }
  get(key, options) {
    return Promise.reject(new Error('.get is not implemented'));
  }
  has(key, options) {
    return Promise.reject(new Error('.has is not implemented'));
  }
  delete(key, options) {
    return Promise.reject(new Error('.delete is not implemented'));
  }
  async *putMany(source, options = {}) {
    for await (const {key, value} of source) {
      await this.put(key, value, options);
      yield {
        key,
        value
      };
    }
  }
  async *getMany(source, options = {}) {
    for await (const key of source) {
      yield this.get(key, options);
    }
  }
  async *deleteMany(source, options = {}) {
    for await (const key of source) {
      await this.delete(key, options);
      yield key;
    }
  }
  batch() {
    let puts = [];
    let dels = [];
    return {
      put(key, value) {
        puts.push({
          key,
          value
        });
      },
      delete(key) {
        dels.push(key);
      },
      commit: async options => {
        await drain__default["default"](this.putMany(puts, options));
        puts = [];
        await drain__default["default"](this.deleteMany(dels, options));
        dels = [];
      }
    };
  }
  async *_all(q, options) {
    throw new Error('._all is not implemented');
  }
  async *_allKeys(q, options) {
    throw new Error('._allKeys is not implemented');
  }
  query(q, options) {
    let it = this._all(q, options);
    if (q.prefix != null) {
      it = filter__default["default"](it, e => e.key.toString().startsWith(q.prefix));
    }
    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter__default["default"](it, f), it);
    }
    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sortAll(it, f), it);
    }
    if (q.offset != null) {
      let i = 0;
      it = filter__default["default"](it, () => i++ >= q.offset);
    }
    if (q.limit != null) {
      it = take__default["default"](it, q.limit);
    }
    return it;
  }
  queryKeys(q, options) {
    let it = this._allKeys(q, options);
    if (q.prefix != null) {
      it = filter__default["default"](it, key => key.toString().startsWith(q.prefix));
    }
    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter__default["default"](it, f), it);
    }
    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sortAll(it, f), it);
    }
    if (q.offset != null) {
      let i = 0;
      it = filter__default["default"](it, () => i++ >= q.offset);
    }
    if (q.limit != null) {
      it = take__default["default"](it, q.limit);
    }
    return it;
  }
}

function dbOpenFailedError(err) {
  err = err || new Error('Cannot open database');
  return errCode__default["default"](err, 'ERR_DB_OPEN_FAILED');
}
function dbDeleteFailedError(err) {
  err = err || new Error('Delete failed');
  return errCode__default["default"](err, 'ERR_DB_DELETE_FAILED');
}
function dbWriteFailedError(err) {
  err = err || new Error('Write failed');
  return errCode__default["default"](err, 'ERR_DB_WRITE_FAILED');
}
function notFoundError(err) {
  err = err || new Error('Not Found');
  return errCode__default["default"](err, 'ERR_NOT_FOUND');
}

class MemoryDatastore extends BaseDatastore {
  constructor() {
    super();
    this.data = {};
  }
  open() {
    return Promise.resolve();
  }
  close() {
    return Promise.resolve();
  }
  async put(key, val) {
    this.data[key.toString()] = val;
  }
  async get(key) {
    const exists = await this.has(key);
    if (!exists)
      throw notFoundError();
    return this.data[key.toString()];
  }
  async has(key) {
    return this.data[key.toString()] !== undefined;
  }
  async delete(key) {
    delete this.data[key.toString()];
  }
  async *_all() {
    yield* Object.entries(this.data).map(([key$1, value]) => ({
      key: new key.Key(key$1),
      value
    }));
  }
  async *_allKeys() {
    yield* Object.entries(this.data).map(([key$1]) => new key.Key(key$1));
  }
}

const SHARDING_FN = 'SHARDING';
const README_FN = '_README';

new interfaceDatastore.Key(SHARDING_FN);
new interfaceDatastore.Key(README_FN);

const log = debug__default["default"]('datastore:core:tiered');
class TieredDatastore extends BaseDatastore {
  constructor(stores) {
    super();
    this.stores = stores.slice();
  }
  async open() {
    try {
      await Promise.all(this.stores.map(store => store.open()));
    } catch (err) {
      throw dbOpenFailedError();
    }
  }
  async put(key, value, options) {
    try {
      await Promise.all(this.stores.map(store => store.put(key, value, options)));
    } catch (err) {
      throw dbWriteFailedError();
    }
  }
  async get(key, options) {
    for (const store of this.stores) {
      try {
        const res = await store.get(key, options);
        if (res)
          return res;
      } catch (err) {
        log(err);
      }
    }
    throw notFoundError();
  }
  async has(key, options) {
    for (const s of this.stores) {
      if (await s.has(key, options)) {
        return true;
      }
    }
    return false;
  }
  async delete(key, options) {
    try {
      await Promise.all(this.stores.map(store => store.delete(key, options)));
    } catch (err) {
      throw dbDeleteFailedError();
    }
  }
  async *putMany(source, options = {}) {
    let error;
    const pushables = this.stores.map(store => {
      const source = pushable__default["default"]();
      drain__default["default"](store.putMany(source, options)).catch(err => {
        error = err;
      });
      return source;
    });
    try {
      for await (const pair of source) {
        if (error) {
          throw error;
        }
        pushables.forEach(p => p.push(pair));
        yield pair;
      }
    } finally {
      pushables.forEach(p => p.end());
    }
  }
  async *deleteMany(source, options = {}) {
    let error;
    const pushables = this.stores.map(store => {
      const source = pushable__default["default"]();
      drain__default["default"](store.deleteMany(source, options)).catch(err => {
        error = err;
      });
      return source;
    });
    try {
      for await (const key of source) {
        if (error) {
          throw error;
        }
        pushables.forEach(p => p.push(key));
        yield key;
      }
    } finally {
      pushables.forEach(p => p.end());
    }
  }
  async close() {
    await Promise.all(this.stores.map(store => store.close()));
  }
  batch() {
    const batches = this.stores.map(store => store.batch());
    return {
      put: (key, value) => {
        batches.forEach(b => b.put(key, value));
      },
      delete: key => {
        batches.forEach(b => b.delete(key));
      },
      commit: async options => {
        for (const batch of batches) {
          await batch.commit(options);
        }
      }
    };
  }
  query(q, options) {
    return this.stores[this.stores.length - 1].query(q, options);
  }
  queryKeys(q, options) {
    return this.stores[this.stores.length - 1].queryKeys(q, options);
  }
}

const writeAtomic = util.promisify(fwa__default["default"]);
async function writeFile(path, contents) {
  try {
    await writeAtomic(path, contents);
  } catch (err) {
    if (err.code === 'EPERM' && err.syscall === 'rename') {
      await fs__default["default"].promises.access(path, fs__default["default"].constants.F_OK | fs__default["default"].constants.W_OK);
      return;
    }
    throw err;
  }
}
class FsDatastore extends datastoreCore.BaseDatastore {
  constructor(location, opts) {
    super();
    this.path = path__default["default"].resolve(location);
    this.opts = Object.assign({}, {
      createIfMissing: true,
      errorIfExists: false,
      extension: '.data',
      deleteManyConcurrency: 50,
      getManyConcurrency: 50,
      putManyConcurrency: 50
    }, opts);
  }
  open() {
    try {
      if (!fs__default["default"].existsSync(this.path)) {
        throw datastoreCore.Errors.notFoundError(new Error(`Datastore directory: ${ this.path } does not exist`));
      }
      if (this.opts.errorIfExists) {
        throw datastoreCore.Errors.dbOpenFailedError(new Error(`Datastore directory: ${ this.path } already exists`));
      }
      return Promise.resolve();
    } catch (err) {
      if (err.code === 'ERR_NOT_FOUND' && this.opts.createIfMissing) {
        mkdirp__default["default"].sync(this.path, { fs: fs__default["default"] });
        return Promise.resolve();
      }
      throw err;
    }
  }
  close() {
    return Promise.resolve();
  }
  _encode(key) {
    const parent = key.parent().toString();
    const dir = path__default["default"].join(this.path, parent);
    const name = key.toString().slice(parent.length);
    const file = path__default["default"].join(dir, name + this.opts.extension);
    return {
      dir: dir,
      file: file
    };
  }
  _decode(file) {
    const ext = this.opts.extension;
    if (path__default["default"].extname(file) !== ext) {
      throw new Error(`Invalid extension: ${ path__default["default"].extname(file) }`);
    }
    const keyname = file.slice(this.path.length, -ext.length).split(path__default["default"].sep).join('/');
    return new interfaceDatastore.Key(keyname);
  }
  async putRaw(key, val) {
    const parts = this._encode(key);
    let file = parts.file;
    if (this.opts.extension.length) {
      file = parts.file.slice(0, -this.opts.extension.length);
    }
    await mkdirp__default["default"](parts.dir, { fs: fs__default["default"] });
    await writeFile(file, val);
  }
  async put(key, val) {
    const parts = this._encode(key);
    try {
      await mkdirp__default["default"](parts.dir, { fs: fs__default["default"] });
      await writeFile(parts.file, val);
    } catch (err) {
      throw datastoreCore.Errors.dbWriteFailedError(err);
    }
  }
  async *putMany(source) {
    yield* parallel__default["default"](map__default["default"](source, ({key, value}) => {
      return async () => {
        await this.put(key, value);
        return {
          key,
          value
        };
      };
    }), this.opts.putManyConcurrency);
  }
  async getRaw(key) {
    const parts = this._encode(key);
    let file = parts.file;
    if (this.opts.extension.length) {
      file = file.slice(0, -this.opts.extension.length);
    }
    let data;
    try {
      data = await fs__default["default"].promises.readFile(file);
    } catch (err) {
      throw datastoreCore.Errors.notFoundError(err);
    }
    return data;
  }
  async get(key) {
    const parts = this._encode(key);
    let data;
    try {
      data = await fs__default["default"].promises.readFile(parts.file);
    } catch (err) {
      throw datastoreCore.Errors.notFoundError(err);
    }
    return data;
  }
  async *getMany(source) {
    yield* parallel__default["default"](map__default["default"](source, key => {
      return async () => {
        return this.get(key);
      };
    }), this.opts.getManyConcurrency);
  }
  async *deleteMany(source) {
    yield* parallel__default["default"](map__default["default"](source, key => {
      return async () => {
        await this.delete(key);
        return key;
      };
    }), this.opts.deleteManyConcurrency);
  }
  async has(key) {
    const parts = this._encode(key);
    try {
      await fs__default["default"].promises.access(parts.file);
    } catch (err) {
      return false;
    }
    return true;
  }
  async delete(key) {
    const parts = this._encode(key);
    try {
      await fs__default["default"].promises.unlink(parts.file);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return;
      }
      throw datastoreCore.Errors.dbDeleteFailedError(err);
    }
  }
  async *_all(q) {
    let prefix = q.prefix || '**';
    prefix = prefix.replace(/^\/+/, '');
    const pattern = `${ prefix }/*${ this.opts.extension }`.split(path__default["default"].sep).join('/');
    const files = glob__default["default"](this.path, pattern, { absolute: true });
    for await (const file of files) {
      try {
        const buf = await fs__default["default"].promises.readFile(file);
        const pair = {
          key: this._decode(file),
          value: buf
        };
        yield pair;
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    }
  }
  async *_allKeys(q) {
    let prefix = q.prefix || '**';
    prefix = prefix.replace(/^\/+/, '');
    const pattern = `${ prefix }/*${ this.opts.extension }`.split(path__default["default"].sep).join('/');
    const files = glob__default["default"](this.path, pattern, { absolute: true });
    yield* map__default["default"](files, f => this._decode(f));
  }
}

try {
  fs.mkdirSync(path.join(os.homedir(), '.dynasty/data'));
} catch {
  // ignore
}

const store = new FsDatastore(path.join(os.homedir(), '.dynasty/data'));
const memoryStore = new MemoryDatastore();
// const dataStore = new ShardingDatastore(store, new NextToLast(2))
const stores = new TieredDatastore([memoryStore, store]);


class DynastyStorage {

    constructor(algorithm = 'sha256') {
      this.algorithm = algorithm;
      this.algorithmBuffer = Buffer.from(algorithm);
      this.algorithmPrefixLength = this.algorithmBuffer.length;
      return this.#init()
    }

    async #init() {
      await stores.open();      
      this.#cleanupMemory();
      this.#cleanupStorage();
      return this
    }

    #cleanupMemory() {
      setTimeout(() => {
        console.time('clean memoryStore');
        let keys = Object.keys(memoryStore.data);
        keys = keys.reduce((set, path) => {
          const parts = path.split(/([^\/]+)$/);
          set[parts[0]] = set[parts[0]] || [];
          set[parts[0]].push(Number(parts[1]));
          return set
        }, {});        
        const time = new Date().getTime();
        let deletions = 0;
        
        for (const i of Object.keys(keys)) {
          keys[i] = keys[i].sort((a, b) => b - a);
          keys[i] = keys[i].filter(stamp => stamp + (3600000 * 48) < time);
          keys[i].forEach(stamp => {
            deletions += 1;
            delete memoryStore[`${i}/${stamp}`];
          });
        }
        console.timeEnd('clean memoryStore');
        console.log(`removed ${deletions} paths`); 
        this.#cleanupMemory();
      }, 10 * 60000);
    }

    #cleanupStorage() {
      setTimeout(async () => {
        console.time('clean Storage');

        const time = new Date().getTime();
        
        let paths = await this.readDir('currencies');
        paths = paths.filter(path$1 => {
          // 1 year and 24h
          return Number(path$1.split(path.posix.sep)[1].split('.data')[0]) + (8790 * 3.6e+6) < time
        });
        
        const sizes = await Promise.all(paths.map(path$1 => promises.stat(path.join(os.homedir(), '.dynasty/data/currencies', path$1))));
        const totalSize = sizes.reduce((totalSize, {size}) => {
          totalSize += size;
          return totalSize
        }, 0);

        try {          
          await queue__default["default"]({}, paths.map(path$1 => path.join('currencies', path$1.replace('.data', ''))), this.delete.bind(this), 5000);
        } catch(e) {
          console.error(e);
        }
        console.timeEnd('clean Storage');
        console.log(`  removed ${paths.length} items \n  freed ${totalSize * 1e-6} Mb`); 
        this.#cleanupStorage();
      }, 10 * 60000);
    }

    createHash(key) {
      const hasher = crypto.createHash(this.algorithm);
      const paths = key.split('/');
      hasher.update(paths.splice(paths.length - 1, 1)[0]);
      const buffer = Buffer.concat([
        this.algorithmBuffer,
        hasher.digest()
      ]);
      paths.push(base32__default["default"].encode(buffer));      
      return paths.join('/')
    }

    createKey(key) {
      return new interfaceDatastore.Key(key)
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
    
    async hasDir(path$1) {      
      try {
        await promises$1.access(path.join(os.homedir(), '.dynasty/data', path$1), fs.constants.R_OK | fs.constants.W_OK);
        return true
      } catch (e) {
        return false        
      }
    }

    async readDir(path$1) {
      const root = path.join(os.homedir(), '.dynasty/data', path$1);
      path$1 = root.split(path.win32.sep);
      path$1 = path$1.join(path.posix.sep);
      const files = await globby__default["default"](path$1);

      return files.map(file => file.split(path$1 + path.posix.sep)[1])
    }

    async query(key = {}) {
      const data = [];
      console.log(store.queryKeys(key));
      for await (const _key of store.queryKeys({})) {
        data.push(_key);
      }
      console.log({data});
      return data
    }

    async queryKeys(key = {}) {
      return store.queryKeys(this.createKey(key))
    }
}

module.exports = DynastyStorage;
