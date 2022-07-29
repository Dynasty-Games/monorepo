'use strict';

/* socket-request-client version 1.6.3 */

class LittlePubSub {
  constructor(verbose = true) {
    this.subscribers = {};
    this.verbose = verbose;
  }
  subscribe(event, handler, context) {
    if (typeof context === 'undefined') {
      context = handler;
    }
    this.subscribers[event] = this.subscribers[event] || { handlers: [], value: null};
    this.subscribers[event].handlers.push(handler.bind(context));
  }
  unsubscribe(event, handler, context) {
    if (typeof context === 'undefined') {
      context = handler;
    }
    if (this.subscribers[event]) {
      const index = this.subscribers[event].handlers.indexOf(handler.bind(context));
      this.subscribers[event].handlers.splice(index);
      if (this.subscribers[event].handlers.length === 0) delete this.subscribers[event];
    }
  }
  publish(event, change) {
    if (this.subscribers[event]) {
      if (this.verbose || this.subscribers[event].value !== change) {
        this.subscribers[event].value = change;
        this.subscribers[event].handlers.forEach(handler => {
          handler(change, this.subscribers[event].value);
        });
      }
    }
  }
}

var clientApi = _pubsub => {
  const subscribe = (topic, cb) => {
    _pubsub.subscribe(topic, cb);
  };
  const unsubscribe = (topic, cb) => {
    _pubsub.unsubscribe(topic, cb);
  };
  const publish = (topic, value) => {
    _pubsub.publish(topic, value);
  };
  const _connectionState = (state) => {
    switch (state) {
      case 0:
        return 'connecting'
      case 1:
        return 'open'
      case 2:
        return 'closing'
      case 3:
        return 'closed'
    }
  };
  const request = (client, request) => {
    return new Promise((resolve, reject) => {
      const state = _connectionState(client.readyState);
      if (state !== 'open') return reject(`coudn't send request to ${client.id}, no open connection found.`)
      request.id = Math.random().toString(36).slice(-12);
      const handler = result => {
        if (result && result.error) return reject(result.error)
        resolve({result, id: request.id, handler});
        unsubscribe(request.id, handler);
      };
      subscribe(request.id, handler);
      send(client, request);
    });
  };
  const send = async (client, request) => {
    return client.send(JSON.stringify(request))
  };
  const pubsub = client => {
    return {
      publish: (topic = 'pubsub', value) => {
        return send(client, {url: 'pubsub', params: { topic, value }})
      },
      subscribe: (topic = 'pubsub', cb) => {
        subscribe(topic, cb);
        return send(client, {url: 'pubsub', params: { topic, subscribe: true }})
      },
      unsubscribe: (topic = 'pubsub', cb) => {
        unsubscribe(topic, cb);
        return send(client, {url: 'pubsub', params: { topic, unsubscribe: true }})
      },
      subscribers: _pubsub.subscribers
    }
  };
  const server = (client) => {
    return {
      uptime: async () => {
        try {
          const { result, id, handler } = await request(client, {url: 'uptime'});
          unsubscribe(id, handler);
          return result
        } catch (e) {
          throw e
        }
      },
      ping: async () => {
        try {
          const now = new Date().getTime();
          const { result, id, handler } = await request(client, {url: 'ping'});
          unsubscribe(id, handler);
          return (Number(result) - now)
        } catch (e) {
          throw e
        }
      }
    }
  };
  const peernet = (client) => {
    return {
      join: async (params) => {
        try {
          params.join = true;
          const requested = { url: 'peernet', params };
          const { result, id, handler } = await request(client, requested);
          unsubscribe(id, handler);
          return result
        } catch (e) {
          throw e
        }
      },
      leave: async (params) => {
        try {
          params.join = false;
          const requested = { url: 'peernet', params };
          const { result, id, handler } = await request(client, requested);
          unsubscribe(id, handler);
          return result
        } catch (e) {
          throw e
        }
      }
    }
  };
  return { send, request, pubsub, server, subscribe, unsubscribe, publish, peernet }
};

if (!globalThis.PubSub) globalThis.PubSub = LittlePubSub;
if (!globalThis.pubsub) globalThis.pubsub = new LittlePubSub({verbose: false});
const socketRequestClient = (url, protocols = 'echo-protocol', options = { retry: false }) => {
  const { retry } = options;
  const api = clientApi(pubsub);
  let tries = 0;
  const onerror = error => {
    if (pubsub.subscribers['error']) {
      pubsub.publish('error', error);
    } else {
      console.error(error);
    }
  };
  const onmessage = message => {
    const {value, url, status, id} = JSON.parse(message.data.toString());
    const publisher = id ? id : url;
    if (status === 200) {
      pubsub.publish(publisher, value);
    } else {
      pubsub.publish(publisher, {error: value});
    }
  };
  const clientConnection = client => {
    const startTime = new Date().getTime();
    return {
      client,
      request: async req => {
        const { result, id, handler } = await api.request(client, req);
        pubsub.unsubscribe(id, handler);
        return result
      },
      send: req => api.send(client, req),
      subscribe: api.subscribe,
      unsubscribe: api.unsubscribe,
      subscribers: api.subscribers,
      publish: api.publish,
      pubsub: api.pubsub(client),
      uptime: () => {
        const now = new Date().getTime();
        return (now - startTime)
      },
      peernet: api.peernet(client),
      server: api.server(client),
      close: exit => {
        client.close();
      }
    }
  };
  return new Promise((resolve, reject) => {
    const init = () => {
      let ws;
      if (typeof process === 'object' && !globalThis.WebSocket) {
        ws = require('websocket').w3cwebsocket;
      } else {
        ws = WebSocket;
      }
      const client = new ws(url, protocols);
      client.onmessage = onmessage;
      client.onerror = onerror;
      client.onopen = () => {
        tries = 0;
        resolve(clientConnection(client));
      };
      client.onclose = message => {
        tries++;
        if (!retry) return reject(options)
        if (tries > 5) {
          console.log(`${protocols} Client Closed`);
          console.error(`could not connect to - ${url}/`);
          return resolve(clientConnection(client))
        }
        if (message.code === 1006) {
          console.log('Retrying in 10 seconds');
          setTimeout(() => {
            return init();
          }, retry);
        }
      };
    };
    return init();
  });
};

class DynastyStorageServer {  
  #port
  #client

  constructor(port = 6000, algorithm = 'sha256') {
    this.#port = port;
    this.algorithm = algorithm;
    this.algorithmBuffer = Buffer.from(algorithm);
    this.algorithmPrefixLength = this.algorithmBuffer.length;
    return this.#init()
  }

  async #init() {
    this.#client = await socketRequestClient(`ws://localhost:${this.#port}`, 'dynasty-data-storage-v1.0.0', {retry: true});
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
    const data = await this.#request('get', key);
    return Buffer.from(data, 'hex')
  }

  async delete(key) {
    return this.#request('delete', key)
  }

  async has(key) {
    const has = this.#request('has', key);
    return has === 'true' ? true : false
  }
}

module.exports = DynastyStorageServer;
