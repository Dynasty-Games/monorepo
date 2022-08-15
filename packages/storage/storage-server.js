'use strict';

var server = require('socket-request-server');
var storage = require('./storage.js');
require('os');
require('path');
require('interface-datastore');
require('@vandeurenglenn/base32');
require('node:fs/promises');
require('it-all');
require('it-drain');
require('it-filter');
require('it-take');
require('interface-datastore/key');
require('err-code');
require('it-map');
require('it-pipe');
require('it-merge');
require('debug');
require('it-pushable');
require('fs');
require('it-glob');
require('mkdirp');
require('util');
require('datastore-core');
require('it-parallel-batch');
require('fast-write-atomic');
require('crypto');
require('fs/promises');
require('globby');
require('@vandeurenglenn/queue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var server__default = /*#__PURE__*/_interopDefaultLegacy(server);

class DynastyStorageServer {  
  #port
  #stores
  #server
  
  constructor(port = 6000, algorithm = 'sha256') {
    this.#port = port;
    this.algorithm = algorithm;
    this.algorithmBuffer = Buffer.from(algorithm);
    this.algorithmPrefixLength = this.algorithmBuffer.length;
    return this.#init()
  }

  async #init() {
    this.#stores = await new storage();
    this.#server = await server__default["default"]({protocol: 'dynasty-data-storage-v1.0.0', port: this.#port}, {
      get: this.#get.bind(this),
      put: this.#put.bind(this),
      delete: this.#delete.bind(this),
      has: this.#has.bind(this),
      hasDir: this.#hasDir.bind(this),
      readDir: this.#readDir.bind(this),
      query: this.#query.bind(this),
      queryKeys: this.#queryKeys.bind(this)
    });

    return this
  }

  async #put({key, value}, response) {
    try {
      await this.#stores.put(key, Buffer.from(value, 'hex'));
      
      response.send('ok');
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500);
    }
    return
  }

  async #get({key}, response) {
    try {
      const data = await this.#stores.get(key);
      response.send(data.toString('hex'));
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500);
    }
    return
  }

  async #delete({key}, response) {
    try {
      await this.#stores.delete(key);
      response.send('ok');
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500);
    }
    return
  }

  async #has({key}, response) {
    try {
      const has = await this.#stores.has(key);
      response.send(String(has));
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500);
    }
    return
  }

  async #hasDir({key}, response) {
    try {
      const has = await this.#stores.hasDir(key);
      response.send(String(has));
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500);
    }
    return
  }

  async #readDir({key}, response) {
    try {
      const data = await this.#stores.readDir(key);
      response.send(data);
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500);
    }
    return
  }

  async #query({key}, response) {
    try {
      const data = await this.#stores.query(key);
      response.send(data.toString('hex'));
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500);
    }
    return
  }

  async #queryKeys({key}, response) {
    try {
      const data = await this.#stores.query(key);
      response.send(data.toString('hex'));
    } catch (e) {
      console.error(e);
      response.send(e.message || e.cause, e.code || 500);
    }
    return
  }
}

module.exports = DynastyStorageServer;
