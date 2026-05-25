# Tejas — Backend

REST API built with **Express + TypeScript**, **Prisma ORM**, and **PostgreSQL**. Implements JWT-based authentication with RBAC (roles & permissions).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Password Hashing | bcrypt |

---

## Project Structure

```
root/
├── backend/
│   └── src/
│       ├── config/         # Environment config
│       ├── constants/      # Status codes, messages
│       ├── lib/            # Shared libs (prisma client, pagination, encryption)
│       ├── middleware/     # JWT middleware, error handler
│       ├── modules/        # Feature modules
│       │   ├── auth/       # Login, logout, refresh
│       │   ├── location/   # Location listing
│       │   └── plant/      # Plant listing
│       └── utils/          # Response helpers (successResponse, errorResponse)
└── frontend/
```

Each module follows a 4-layer pattern:

```
router → controller → service → repository
```

- **Router** — defines routes, applies middleware
- **Controller** — parses request (query params, body), calls service
- **Service** — business logic, returns typed response
- **Repository** — all Prisma/DB interactions

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- `.env` file configured (see below)

### Install

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/tejas
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
```

### Database Setup

```bash
# Pull schema from existing database
npx prisma db pull
```

### Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## API Overview

### Auth

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/auth/login` | No | Login with username and password |
| POST | `/auth/refresh` | No | Get new access + refresh tokens |
| POST | `/auth/logout` | Yes | Logout (stateless) |

### Locations

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/locations?page=1&limit=10&name=` | No | Paginated location list |

### Plants

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/plants?page=1&limit=10&name=` | No | Paginated plant list |

---

## Auth Flow

1. `POST /auth/login` — returns `accessToken` (15m) and `refreshToken` (7d)
2. Pass `accessToken` as `Authorization: Bearer <token>` on protected routes
3. When access token expires, call `POST /auth/refresh` with the `refreshToken` to get a new pair
4. Access token payload includes `roles` and `permissions` for RBAC enforcement

---

## Response Shape

All responses follow a consistent envelope:

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "body": { }
}
```

Paginated responses wrap data inside `body`:

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "body": {
    "data": [],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```