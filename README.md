# PHS Assessment – Monorepo

This repository contains both the backend (Node.js/Express/TypeScript) and frontend (web) projects for the PHS Assessment.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker)

---
## Project Structure

```
phs-assessment/
│
├── server/ # Backend API (Node.js, Express, TypeScript)
├── web/ # Frontend (e.g., React, Vite, etc.)
└── README.md # This file
```
---

## Backend Setup (`server`)

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a copy `.env` from `.env.sample` file in the `server` directory:

```bash
cp .env.example .env
```

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=phs_assessment

CLIENT_URL=http://localhost:5173
```

### 3. Set up PostgreSQL

Create database name `phs_assessment` on postgres:

```
psql -U postgres
psql> CREATE DATABASE phs_assessment;
```


### 4. Start the Backend Server

```bash
npm run dev
```

- The server will run on [http://localhost:3000](http://localhost:3000) by default.

---

## Frontend Setup (`web`)

### 1. Install dependencies

```bash
cd web
npm install
```

### 2. Configure Environment Variables (if needed)

If your frontend needs to know the backend API URL, create a `.env` by copying `.env.sample` file in the `web` directory:

```bash
cp .env.example .env
```

```
# .env

VITE_API_URL=http://localhost:3000/api
```

### 3. Start the Frontend

```bash
npm run dev
```

- The frontend will typically run on [http://localhost:5173](http://localhost:5173) (or similar, check your terminal output).

---

## API Reference

### GET `/api/projects`

- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `s` (optional): Search string for project name

- **Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Project Name",
      "description": "Project Description"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Troubleshooting

- Make sure your `.env` files are correctly set up.
- Ensure PostgreSQL is running and accessible.
- If ports are in use, adjust them in your `.env` files.

---