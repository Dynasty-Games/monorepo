import {create, close, rankings} from './tasks/tasks.js'
import DynastyStorageClient from '../../storage/src/storage-client.js';

(async () => {
  globalThis.storage = await new DynastyStorageClient()
  const tasks = [create(), close(), rankings()]
  await tasks[1].job() // try closing on each start

  for (const task of tasks) {
    task.runner.start()
  }
})()
