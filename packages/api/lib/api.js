import Koa from 'koa';
import cors from '@koa/cors'
import Router from '@koa/router'
import marketdata from './routes/marketdata.js'
import competitions from './routes/competitions.js'
import faucet from './routes/faucet.js'
import Runner from './jobs/runner.js'
import DynastyStorageClient from '../../storage/src/storage-client.js';

(async () => {
  globalThis.storage = await new DynastyStorageClient()

  const runner = new Runner()
  const server = new Koa();
  
  server
    .use(cors({ origin: '*' }))
    .use(marketdata.routes())
    .use(faucet.routes())
    .use(competitions.routes())
    .use(marketdata.allowedMethods());
  
  server.listen(8668);
})();
