import Router from '@koa/router'

const router = new Router();

const filter = ctx => {
  
  const { category, style, id, name } = ctx.request.query

  ctx.body = ctx.body.filter(item => {
    if (category && style && id && name) return item.category === Number(category) && item.style === Number(style) && item.id === Number(id) && item.name.toLowerCase() === name
    if (category && style && id) return item.category === Number(category) && item.style === Number(style) && item.id === Number(id)
    if (category && style && name) return item.category === Number(category) && item.style === Number(style) && item.name.toLowerCase() === name
    if (category && style) return item.category === Number(category) && item.style === Number(style)
    if (category && name) return item.category === Number(category) && item.name.toLowerCase() === name
    if (name && style) return item.name.toLowerCase() === name && item.style === Number(style)
    
    if (id) return item.id === Number(id)
    if (name) return item.name.toLowerCase() === name
    if (category) return item.category === Number(category)
    if (style) return item.style === Number(style)
    return true
  })
  return 
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
  ctx.body = JSON.parse((await storage.get('/competitions/competitions')).toString())
  filter(ctx)
})

router.get('/open-competitions', async ctx => {
  ctx.body = JSON.parse((await storage.get('/competitions/open')).toString())
  filter(ctx)
})

router.get('/closed-competitions', async ctx => {
  ctx.body = JSON.parse((await storage.get('/competitions/closed')).toString())
  filter(ctx)
})

router.get('/live-competitions', async ctx => {
  ctx.body = JSON.parse((await storage.get('/competitions/live')).toString())  
  filter(ctx)
})

router.get('/competition-result', async ctx => {
  ctx.body = JSON.parse((await storage.get(`/competitions/results/${ctx.query.id}`)).toString())  
  filter(ctx)
})

export default router
