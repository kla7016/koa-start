import Koa from "koa";
import KoaRouter from "koa-router";
import KoaJson from "koa-json";
import "@babel/polyfill";
import bodyParser from "koa-bodyparser";

const port = 3100;
const app = new Koa();
const router = new KoaRouter();
const api = require("./api/api");
const config = require("config");
// Use as middleware
app.use(bodyParser());
app.use(KoaJson());

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

router.get("/", (ctx, next) => {
  ctx.body = {
    text: "Hello World",
    env: config.get("env")
  };
});

app.use(router.routes()).use(router.allowedMethods());
app.use(api.routes(), api.allowedMethods());
app.listen(port, () => console.log(`Server Running at port: ${port}`));
