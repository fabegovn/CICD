const request = require('supertest');
const { app, resetTodos } = require('../app');

describe('Todo API', () => {
  beforeEach(() => {
    resetTodos();
  });

  test('GET /health returns ok', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /todos returns the todo list', async () => {
    const response = await request(app).get('/todos');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('POST /todos creates a new todo', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ text: 'Write CI/CD tests' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ text: 'Write CI/CD tests' });
    expect(response.body.id).toBeDefined();
  });
});

