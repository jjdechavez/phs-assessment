# PHS Assessment Server

This is the backend server for the PHS Assessment project, built with Node.js, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials and other configuration.

4. Create the database:
```sql
CREATE DATABASE phs_assessment;
```

## Development

To run the server in development mode:
```bash
npm run dev
```

## Building for Production

To build the TypeScript code:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## API Endpoints

### GET /api/projects
Retrieves a paginated list of projects.

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 10)

Response:
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