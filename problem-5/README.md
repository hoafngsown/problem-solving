# Problem 5 — CRUD API Server

Express + TypeScript + PostgreSQL + TypeORM

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose

## Getting Started

### Docker (recommended)

```bash
docker compose up --build
```

### Local Development

```bash
npm install
docker compose up db -d   # start PostgreSQL only
cp .env.example .env
npm run dev
```

Server runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint       | Description                   |
| ------ | -------------- | ----------------------------- |
| POST   | /api/v1/items     | Create an item                |
| GET    | /api/v1/items     | List items (supports filters) |
| GET    | /api/v1/items/:id | Get item by id                |
| PUT    | /api/v1/items/:id | Update item                   |
| DELETE | /api/v1/items/:id | Delete item                   |

### Query Parameters (List)

| Param    | Example          | Description              |
| -------- | ---------------- | ------------------------ |
| name     | `?name=widget`   | Search by name           |
| status   | `?status=active` | Filter by status         |
| minPrice | `?minPrice=10`   | Minimum price            |
| maxPrice | `?maxPrice=50`   | Maximum price            |
| page     | `?page=1`        | Page number              |
| limit    | `?limit=10`      | Items per page (max 100) |
| sort     | `?sort=price`    | Sort field               |
| order    | `?order=ASC`     | ASC or DESC              |

## Testing API

Pre-built request files are in `requests/` folder. Open any `.http` file in VS Code and click **Send Request** above each request.

Requires [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension.

```
requests/
├── health.http        # Health check
├── create-item.http   # Create items
├── list-items.http    # List, filter, sort, paginate
├── get-item.http      # Get by id
├── update-item.http   # Update by id
├── delete-item.http   # Delete by id
└── validation.http    # Validation error cases
```
