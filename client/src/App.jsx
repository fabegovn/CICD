import { useEffect, useState } from 'react';
import './App.css';

// In development, the Vite proxy handles "/todos" and "/health".
// In production, set VITE_API_BASE_URL to your backend URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Loading todos...');

  async function loadTodos() {
    setStatus('Loading todos...');

    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
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

    await fetch(`${API_BASE_URL}/todos`, {
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
    await fetch(`${API_BASE_URL}/todos/${id}`, {
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
