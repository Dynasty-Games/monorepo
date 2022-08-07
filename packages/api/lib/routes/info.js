import Router from '@koa/router'
import cache from '../cache'

const router = new Router();

router.get('/styles', async ctx => {
  let data = cache.get('info')
  if (data) ctx.body = data.styles
})

router.get('/categories', async ctx => {
  let data = cache.get('info')
  if (data) ctx.body = data.categories
})

export default router
