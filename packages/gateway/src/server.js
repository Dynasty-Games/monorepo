import Koa from 'koa'
import cors from '@koa/cors'
import {resolve} from 'dnslink'
import fileType from 'file-type'
import {readFileSync} from 'fs'
import Node from './node'
import koastatic from 'koa-static'
const gate = new Koa();

gate.use(cors('*'));
gate.use(koastatic('./monorepo/packages/app/www'))
const tryFetch = async ctx => {
  let url = decodeURI(ctx.originalUrl);
  url = url.split('/?')
  url = url[0].split('?_sw')[0]

  try {
    let path

    if (url === '/' || url === '') path = 'index.html'
    else path = url.startsWith('/') ? url.substring(1) : url

    const hash = await resolve(ctx.header.host);

    if (hash && hash.startsWith('/lfc/')) {
      let dirs = await peernet.ls(hash.replace('/lfc/', ''), {pin: true})
      dirs = dirs.filter(item => item.path === path)
      if (dirs[0]) {
        ctx.body = await peernet.cat(dirs[0].hash, {pin: true})
        const type = await fileType.fromBuffer(Buffer.from(ctx.body))
        if (!type || type.ext === ('xml')) {
          if (path.includes('.html')) ctx.type = 'text/html';
          if (path.includes('.js')) ctx.type = 'application/javascript';
          if (path.includes('.json')) ctx.type = 'application/json';
          if (path.includes('.svg')) ctx.type = 'image/svg+xml';
          if (path.includes('.png')) ctx.type = 'image/png';
          if (path.includes('.jpg')) ctx.type = 'image/jpg';
        } else ctx.type = type.mime
      } else {
        ctx.status = 404
      }
    }
  } catch (e) {
    ctx.status = 300
  }
}

new Node().then(() => {
  gate.use(tryFetch);

  gate.listen(9090)
})
