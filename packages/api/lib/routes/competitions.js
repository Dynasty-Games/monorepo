import Router from '@koa/router'
import cache from './../cache'
import competitions from './../fetchers/competitions'
import categories from './../fetchers/categories'

const router = new Router();

// router.get('/competitionsByCategory', async ctx => {
  
//   let data = cache.get('/categories')
//   if (!data) {
//     data = await categories()
//     cache.add('/categories', data)
//   }
//   ctx.body = data[ctx.query.category]
// })

/**
 * fetch('/contest?id=lambomaker')
 */
router.get('/competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = [...data.open, ...data.closed]
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = [...data.open, ...data.closed]
  }
})

router.get('/open-competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.open
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.open
  }
})

router.get('/closed-competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.closed
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.closed
  }
})

export default router
