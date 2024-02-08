import { Router } from "https://deno.land/x/oak@v13.1.0/mod.ts";
import { getDb } from "../helper/db_client.ts";
import { ObjectId } from "npm:mongodb@6";

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

router.get('/todos',async (ctx) => {
  const todos =  getDb().collection('todos').find();
  const realTodos = await todos.toArray(); 
  const transfromedTodos = realTodos.map((todo) => {
     return { id: todo._id as unknown , text: todo.text}
  })
  ctx.response.body = { todos: transfromedTodos };
});

router.post('/todos', async (ctx) => {
  const data = await ctx.request.body.json();
  const newTodo: Todo = {
    text: data.text,
  };
  await getDb().collection('todos').insertOne(newTodo);
  ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId;
  const data = await ctx.request.body.json();

  getDb().collection('todos').updateOne({ _id: new ObjectId(tid)},{ text : data.text});
  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', (ctx) => {
  const tid = ctx.params.todoId;
  getDb().collection('todos').deleteOne({_id : new ObjectId(tid)});
  ctx.response.body = { message: 'Deleted todo' };
});

export default router;
