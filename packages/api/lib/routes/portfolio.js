import Router from '@koa/router'

const router = new Router();

router.get('/portfolio-points', async ctx => {
  let {portfolio} = ctx.request.query
  portfolio = portfolio.split(',')
  let stamps = await Promise.all(portfolio.map(id => storage.readDir(`currencies/${id}`)))  
  
  let points = await Promise.all(portfolio.map(async (id, i) => {
    stamps[i] = stamps[i].map(stamp => stamp.split('.data')[0])

    stamps[i] = stamps[i].sort((a, b) => b - a)
    return (JSON.parse((await storage.get(`currencies/${id}/${stamps[i][0]}`)).toString())).points
  }))

  const total = points.reduce((prev, curr) => {
    return prev + curr
  }, 0)

  ctx.body = {points, total}
})

export default router
