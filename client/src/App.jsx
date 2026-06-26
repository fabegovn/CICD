import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Loading todos...');

  async function loadTodos() {
    setStatus('Loading todos...');

    try {
      const response = await fetch('/todos');
      const data = await response.json();
      setTodos(data);
      setStatus('');
    } catch (error) {
      setStatus('Could not load todos. Make sure the server is running.');
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleAddTodo(event) {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    await fetch('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: trimmedText })
    });

    setText('');
    loadTodos();
  }

  async function handleDeleteTodo(id) {
    await fetch(`/todos/${id}`, {
      method: 'DELETE'
    });

    loadTodos();
  }

  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">React + Express + CI/CD</p>
        <h1>Todo Web App</h1>
        <p className="subtitle">
          A beginner-friendly example that shows a full CI/CD workflow from code
          to build.
        </p>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <label htmlFor="todo-text">New todo</label>
          <div className="form-row">
            <input
              id="todo-text"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Add a simple task"
            />
            <button type="submit">Add</button>
          </div>
        </form>

        {status ? <p className="status">{status}</p> : null}

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span>{todo.text}</span>
              <button type="button" onClick={() => handleDeleteTodo(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;

