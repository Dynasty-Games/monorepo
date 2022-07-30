const _runQueue = (items, data, job) => Promise.all(items.map(item => job(item, data)))

const runQueue = async (data, queue, job) => {
  await _runQueue(queue.splice(0, queue.length > 12 ? 12 : queue.length), data, job)
  if (queue.length > 0) return runQueue(data, queue, job)
}

export default runQueue