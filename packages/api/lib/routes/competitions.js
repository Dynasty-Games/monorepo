import Router from '@koa/router'
import cache from './../cache'
import competitions from './../fetchers/competitions'

const router = new Router();

const filter = ctx => {
  
  const { category, style, id, name } = ctx.request.query

  return ctx.body.filter(item => {
    if (category && style && id && name) return item.category === Number(category) && item.style === Number(style) && item.id === Number(id) && item.name === name
    if (category && style && id) return item.category === Number(category) && item.style === Number(style) && item.id === Number(id)
    if (category && style && name) return item.category === Number(category) && item.style === Number(style) && item.name === name
    if (category && style) return item.category === Number(category) && item.style === Number(style)
    if (category && name) return item.category === Number(category) && item.name === name
    if (name && style) return item.name === name && item.style === Number(style)
    
    if (id) return item.id === Number(id)
    if (name) return item.name === name
    if (category) return item.category === Number(category)
    if (style) return item.style === Number(style)
  })
    
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
  if (data) ctx.body = [...data.live, ...data.open, ...data.closed]
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = [...data.live, ...data.open, ...data.closed]
  }
  filter(ctx)
})

router.get('/open-competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.open
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.open
  }
  filter(ctx)
})

router.get('/closed-competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.closed
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.closed
  }
  filter(ctx)
})

router.get('/live-competitions', async ctx => {
  let data = cache.get('competitions')
  if (data) ctx.body = data.live
  else {
    data = await competitions()
    cache.add('competitions', data)
    ctx.body = data.live
  }
  filter(ctx)
})

export default router
