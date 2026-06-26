const express = require('express');

const app = express();
app.use(express.json());

// Keep the todo list in memory so the project stays simple for beginners.
const initialTodos = [
  { id: 1, text: 'Learn CI/CD basics' },
  { id: 2, text: 'Build a Todo app' }
];

const todos = [];
let nextId = 1;

function resetTodos() {
  todos.splice(0, todos.length, ...initialTodos.map((todo) => ({ ...todo })));
  nextId = todos.length + 1;
}

resetTodos();

// app.get('/health', (req, res) => {
//   res.json({ status: 'ok' });
// });

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const text = (req.body?.text || '').trim();

  if (!text) {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  const todo = { id: nextId++, text };
  todos.push(todo);

  res.status(201).json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const [deletedTodo] = todos.splice(index, 1);
  res.json(deletedTodo);
});

module.exports = {
  app,
  resetTodos
};

