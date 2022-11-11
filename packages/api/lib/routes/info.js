import Router from '@koa/router'
import cache from '../cache'

const router = new Router();

router.get('/styles', async ctx => ctx.body = (await storage.get('/competitions/styles')).toString())

router.get('/categories', async ctx => ctx.body = (await storage.get('/competitions/categories')).toString())

router.get('/open-competition-names', async ctx => ctx.body = (await storage.get('/competitions/categories')).toString())

router.get('/live-competition-names', async ctx => ctx.body = (await storage.get('/competitions/categories')).toString())

router.get('/competition-names', async ctx => ctx.body = (await storage.get('/competitions/names')).toString())

export default router
