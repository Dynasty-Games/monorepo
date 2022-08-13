const _runQueue = (items, data, job) => Promise.all(items.map(item => job(item, data)))

const runQueue = async (data, queue, job) => {
  await _runQueue(queue.splice(0, queue.length > 10 ? 10 : queue.length), data, job)
  if (queue.length > 0) return runQueue(data, queue, job)  
}

export default async (data, queue, job) => {
  console.time(job.name);
  await runQueue(data, queue, job)
  console.timeEnd(job.name);
  return
}