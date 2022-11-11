import Router from '@koa/router'

const router = new Router();

router.get('/portfolio-points', async ctx => {
  let {portfolio} = ctx.request.query
  portfolio = portfolio.split(',')
  let stamps = await Promise.allSettled(portfolio.map(id => storage.readDir(`currencies/${id}`)))  
  then((results) => results.forEach((result) => console.log(result.status)));

  let points = await Promise.allSettled(portfolio.map(async (id, i) => {
    if (stamps[i].result === 'rejected') {
      console.warn(`currency id not found: ${portfolio[i]}`);
      return 0
    }

    stamps[i] = stamps[i].map(stamp => stamp.value.split('.data')[0])

    stamps[i] = stamps[i].sort((a, b) => b - a)
    return (JSON.parse((await storage.get(`currencies/${id}/${stamps[i][0]}`)).toString())).points
  }))

  const total = points.reduce((prev, curr) => {
    if (curr.status === 'rejected') return prev
    return prev + curr.value
  }, 0)

  ctx.body = {points, total}
})

export default router
