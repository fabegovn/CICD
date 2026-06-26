# Todo CI/CD Demo

This project is a beginner-friendly example of a complete CI/CD workflow.
It includes a tiny Express API, a React frontend built with Vite, basic tests,
and a GitHub Actions pipeline.

## What This Project Shows

- How a frontend and backend fit together
- How to test API routes with Jest and Supertest
- How to test a React app with Vitest
- How GitHub Actions runs checks on every push and pull request
- How a project can be deployed manually or automatically after CI succeeds

## Folder Structure

```text
/
├── client/
├── server/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── README.md
└── package.json
```

## Features

- View all todos
- Add a todo
- Delete a todo
- Health check endpoint at `/health`

## Tech Stack

- React with Vite
- Node.js with Express
- Jest
- Supertest
- Vitest
- JavaScript only

## Install

Install dependencies from the repository root:

```bash
npm install
```

## Run Locally

Open two terminals:

### Start the backend

```bash
npm run dev:server
```

The API runs on `http://localhost:3001`.

### Start the frontend

```bash
npm run dev:client
```

The frontend runs on Vite's local dev server and proxies API requests to the backend.

## API Endpoints

### `GET /health`

Response:

```json
{
  "status": "ok"
}
```

### `GET /todos`

Returns the current in-memory todo list.

### `POST /todos`

Send JSON like this:

```json
{
  "text": "Learn CI/CD"
}
```

### `DELETE /todos/:id`

Deletes a todo by id.

## Testing

### Backend tests

The backend uses Jest and Supertest.

```bash
npm run test:server
```

Covered tests:

- `GET /health`
- `GET /todos`
- `POST /todos`

### Frontend test

The frontend uses one simple Vitest test.

```bash
npm run test:client
```

This test checks that the main app title renders correctly.

## How CI Works

The GitHub Actions workflow is in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

Every push and pull request runs these steps:

1. Checkout code
2. Install Node.js
3. Install dependencies
4. Run backend tests
5. Run frontend tests
6. Build frontend

If any test or build step fails, the workflow fails.

### Example GitHub Actions Output

This is the kind of output you will see in GitHub Actions:

```text
Run backend tests
PASS server/__tests__/app.test.js

Run frontend tests
PASS client/src/App.test.jsx

Build frontend
vite v5.x.x building for production...
✓ built in 1.2s
```

## How CD Works

This project shows two deployment options after CI succeeds.

### Option A: Manual Deployment

1. CI runs on GitHub Actions
2. If all checks pass, a person deploys the app manually
3. This is the simplest option for learning

This option does not need extra GitHub Actions files.

### Option B: Automatic Deployment to Vercel

1. CI runs on GitHub Actions
2. If CI succeeds, a second workflow deploys to Vercel
3. The deployment uses Vercel secrets stored in GitHub

The actual workflow lives in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

For Vercel, you also need these GitHub Secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

If you want a fully automated Vercel deployment, connect your GitHub repo to
Vercel and point the production build to the `client` folder.

## Vercel Setup

Because this repository is a monorepo, the safest setup is to deploy the
`client` folder as the Vercel project and keep the backend on a separate host.

### Step 1: Create a Vercel project

1. Sign in to Vercel.
2. Import this GitHub repository.
3. In the monorepo settings, set the **Root Directory** to `client`.

Vercel documents that monorepos use a root directory per project, and that you
select it before deploying. See the Vercel monorepo docs for the dashboard
workflow. Source: [Vercel Monorepos](https://vercel.com/docs/monorepos)

### Step 2: Confirm build settings

Use these settings for the frontend project:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

These match the Vite app in [client/package.json](./client/package.json), and
Vercel project configuration lets you override build and output settings when
needed. Source: [Vercel Project Configuration](https://vercel.com/docs/project-configuration)

### Step 3: Set the production API URL

The frontend now reads `VITE_API_BASE_URL` from the environment in
[client/src/App.jsx](./client/src/App.jsx).

Set `VITE_API_BASE_URL` in the Vercel project settings to the public URL of
your backend API.

Why this is needed:
- local development uses the Vite proxy
- production needs a real backend URL

### Step 4: Deploy the backend separately

Vercel is great for the frontend, but the current Express backend is a normal
Node server. To keep this project simple, host the backend on another service
or convert it to serverless functions later.

### Step 5: Let GitHub trigger deployments

Once the Vercel project is connected to GitHub, each push to the connected
branch creates a deployment automatically. Source: [Vercel Deployments](https://vercel.com/docs/deployments)

### Step 6: Optional GitHub Actions deploy workflow

If you keep [.github/workflows/deploy.yml](./.github/workflows/deploy.yml), make
sure the Vercel project is linked correctly and the Vercel token secrets are set.
This workflow is optional if you use Vercel's Git integration directly.

## Notes for Beginners

- The todo list lives in memory, so refreshing the server resets it.
- The backend and frontend are kept separate so each part can be tested alone.
- CI catches mistakes early before code is merged.
- CD uses CI as a gate so deployment only happens after the project passes checks.
