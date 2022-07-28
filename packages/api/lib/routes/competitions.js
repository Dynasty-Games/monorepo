import Router from '@koa/router'
import cache from './../cache'
import competitions from './../fetchers/competitions'
import categories from './../fetchers/categories'
import { query } from 'express';

const router = new Router();

const filter = ctx => {
  
  const { category, style, id } = ctx.request.query
  if (params.category && params.style && params.id) {
    ctx.body = ctx.body.filter(item => item.category === category && item.style === style && item.id == id)
    return
  }

  if (category && id) {
    ctx.body = ctx.body.filter(item => item.category === category && item.id === id)
    return
  }

  if (style && id) {
    ctx.body = ctx.body.filter(item => item.id === id && item.style === style)
    return
  }

  if (category && style) {
    ctx.body = ctx.body.filter(item => item.category === category && item.style === style)
    return
  }

  if (category) {
    ctx.body = ctx.body.filter(item => item.category === category)
    return
  }

  if (style) {
    ctx.body = ctx.body.filter(item => item.category === category)
    return
  }
}

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
  return filter(ctx)
})

router.get('/open-competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.open
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.open
  }
  return filter(ctx)
})

router.get('/closed-competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.closed
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.closed
  }
  return filter(ctx)
})

router.get('/live-competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.live
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.live
  }
  return filter(ctx)
})

export default router
