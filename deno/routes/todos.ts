import { Router } from "https://deno.land/x/oak@v13.1.0/mod.ts";
import { getDb } from "../helper/db_client.ts";

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

let todos: Todo[] = [];

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
  const todoIndex = todos.findIndex((todo) => {
    return todo.id === tid;
  });
  todos[todoIndex] = { id: todos[todoIndex].id, text: data.text };
  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', (ctx) => {
  const tid = ctx.params.todoId;
  todos = todos.filter((todo) => todo.id !== tid);
  ctx.response.body = { message: 'Deleted todo' };
});

export default router;
