import { Application } from "https://deno.land/x/oak@v13.1.0/mod.ts";

import todosRoutes from './routes/todos.ts';
import { connect } from "./helper/db_client.ts";

connect();
const app = new Application();

app.use(async (_ctx, next) => {
  console.log('Middleware!');
  await next();
});

app.use(async (ctx,next)=> {
  ctx.response.headers.set('Access-Control-Allow-Origin','*');
  ctx.response.headers.set('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
  ctx.response.headers.set('Access-Control-Allow-Headers','Content-Type');
  await next();
})

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });