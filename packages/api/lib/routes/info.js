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

router.get('/open-competition-names', async ctx => {
  let data = cache.get('info')
  if (data) ctx.body = data.openNames
})

router.get('/live-competition-names', async ctx => {
  let data = cache.get('info')
  if (data) ctx.body = data.liveNames
})

router.get('/competition-names', async ctx => {
  let data = cache.get('info')
  if (data) ctx.body = data.names
})

export default router
