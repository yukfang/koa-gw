const fs  = require('fs');
const Koa = require('koa');
const cors = require('@koa/cors');
const crypto = require('crypto');
const { koaBody } = require('koa-body');
const router = require('koa-router')();
 

const koaApp = new Koa();

const delay  = (ms) => new Promise((res,rej) => {setTimeout(res, ms)})


// Calc x-response-time
koaApp.use(cors());
koaApp.use(koaBody());
koaApp.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

koaApp.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Request-Id', `${ctx.requestId}`);
    ctx.set('X-Response-Time', `${ms}ms`);
});
// Calc x-response-time End

koaApp.use(async (ctx, next) => {
    ctx.requestId = crypto.randomUUID({disableEntropyCache: false});
    console.log(`${new Date(Date.now()).toISOString()} ctx.requestId = ${ctx.requestId}`)
    await next();
});

/** koa App Route Binding */
router.get('/',                             home)
router.all('(.*)', home)

koaApp.use(router.routes());



  function home(ctx) {
    ctx.body = fs.readFileSync('index.html', {encoding:'utf8', flag:'r'});




    console.log(ctx)
    console.log(ctx.request.body)

}











/** Init & Exports */
async function init() { console.log(`Server Init ---> ${(new Date(Date.now())).toISOString()}`);}

module.exports = {
  koaApp,
  init,
};




/** Get Request Query from ctx */
//  ctx.query.order_id

/** Get Response Headers from ctx */
// ctx.response.header['uuid']