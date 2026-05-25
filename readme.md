# DevPulse — Internal Tech Issue & Feature Tracker

A collaborative backend API for software teams to report bugs, suggest features, and coordinate resolutions. Built with Node.js, TypeScript, Express, and PostgreSQL.

## Live URL

```
https://dev-plus-eight.vercel.app/
```


---

## Features

- User registration and login with JWT authentication
- Role-based access control — `contributor` and `maintainer` roles
- Create, read, update, and delete issues
- Filter issues by `type` and `status`
- Sort issues by newest or oldest
- Passwords hashed with bcrypt — never exposed in responses
- Centralized error handling with proper HTTP status codes
- Request logging middleware
- PostgreSQL with raw SQL — no ORM, no JOINs

---

## Tech Stack

| Technology     | Usage                                      |
| -------------- | ------------------------------------------ |
| Node.js (LTS)  | Runtime environment                        |
| TypeScript     | Type-safe development                      |
| Express.js     | Web framework with modular routing         |
| PostgreSQL      | Relational database                        |
| `pg`           | Native PostgreSQL driver (`pool.query()`)  |
| bcryptjs       | Password hashing (salt rounds: 12)         |
| jsonwebtoken   | JWT generation and verification            |
| http-status-codes | Consistent HTTP status code references  |

---

## Getting Started

### Prerequisites

- Node.js 24.x or higher
- PostgreSQL database (NeonDB / Supabase / ElephantSQL recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/umme-Tahazzee/DevPlus.git
cd devpulse

# 2. Install dependencies
npm install

# 3. Create .env file (see Environment Variables section)

# 4. Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://neondb_owner:npg_pKTC4U6xPvhc@ep-lucky-math-aqr1fw6v-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=5000
JWT_SECRET=abckdedXXXX,
JWT_REFRESH_SECRET=9mXvT4qLpZ7sDcF2hJnK8wErY5uIbQaW3oPtRgVkLsNd
```

---

## API Endpoints

Base URL: `/api`

### Auth

| Method | Endpoint          | Access  | Description              |
| ------ | ----------------- | ------- | ------------------------ |
| POST   | `/auth/signup`    | Public  | Register a new user      |
| POST   | `/auth/login`     | Public  | Login and receive JWT    |

### Issues

| Method | Endpoint          | Access                          | Description                        |
| ------ | ----------------- | --------------------------------| ---------------------------------- |
| POST   | `/issues`         | Authenticated                   | Create a new issue                 |
| GET    | `/issues`         | Public                          | Get all issues (filter + sort)     |
| GET    | `/issues/:id`     | Public                          | Get a single issue by ID           |
| PATCH  | `/issues/:id`     | Maintainer or Issue Owner       | Update an issue                    |
| DELETE | `/issues/:id`     | Maintainer only                 | Delete an issue                    |

### Query Parameters for `GET /api/issues`

| Param    | Values                              | Default   |
| -------- | ----------------------------------- | --------- |
| `sort`   | `newest`, `oldest`                  | `newest`  |
| `type`   | `bug`, `feature_request`            | (none)    |
| `status` | `open`, `in_progress`, `resolved`   | (none)    |

**Example:**
```
GET /api/issues?sort=oldest&type=bug&status=open
```

### Request & Response Examples

**POST /api/auth/signup**
```json
// Request Body
{
  "name": "John Doe",
  "email": "john@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}

// Response 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

**POST /api/auth/login**
```json
// Request Body
{
  "email": "john@devpulse.com",
  "password": "securePassword123"
}

// Response 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@devpulse.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  }
}
```

**POST /api/issues** *(Authorization header required)*
```json
// Headers
// Authorization: <JWT_TOKEN>

// Request Body
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}

// Response 201
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

---

## Database Schema

### Table: `users`

| Column       | Type          | Constraints                                      |
| ------------ | ------------- | ------------------------------------------------ |
| `id`         | SERIAL        | PRIMARY KEY                                      |
| `name`       | VARCHAR(100)  | NOT NULL                                         |
| `email`      | VARCHAR(100)  | UNIQUE, NOT NULL                                 |
| `password`   | TEXT          | NOT NULL — bcrypt hashed, never returned         |
| `role`       | VARCHAR(20)   | DEFAULT `'contributor'`, CHECK `contributor` or `maintainer` |
| `created_at` | TIMESTAMP     | DEFAULT NOW()                                    |
| `updated_at` | TIMESTAMP     | DEFAULT NOW()                                    |

### Table: `issues`

| Column        | Type         | Constraints                                               |
| ------------- | ------------ | --------------------------------------------------------- |
| `id`          | SERIAL       | PRIMARY KEY                                               |
| `title`       | VARCHAR(150) | NOT NULL                                                  |
| `description` | TEXT         | NOT NULL                                                  |
| `type`        | VARCHAR(30)  | NOT NULL, CHECK `bug` or `feature_request`                |
| `status`      | VARCHAR(30)  | DEFAULT `'open'`, CHECK `open`, `in_progress`, `resolved` |
| `reporter_id` | INT          | NOT NULL — references users.id (app-level validation)     |
| `created_at`  | TIMESTAMP    | DEFAULT NOW()                                             |
| `updated_at`  | TIMESTAMP    | DEFAULT NOW()                                             |

---

## Project Structure

```
src/
├── config/
│   └── index.ts          # Environment variable config
├── db/
│   └── index.ts          # PostgreSQL pool + table initialization
├── middleware/
│   ├── auth.ts           # JWT verification middleware
│   ├── globalerror.ts    # Centralized error handler
│   └── logger.ts         # HTTP request logger
├── module/
│   ├── auth/             # Login controller, service, route
│   ├── issues/           # Issues CRUD controller, service, route
│   └── user/             # Registration controller, service, route
├── routes/
│   └── index.ts          # Central route registry
├── type/
│   └── express/
│       └── index.d.ts    # Express Request type extension
├
├── app.ts                # Express app setup
└── server.ts             # Server entry point
```

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

| Status | Meaning                                           |
| ------ | ------------------------------------------------- |
| 400    | Validation error or missing required field        |
| 401    | Missing, expired, or invalid JWT token            |
| 403    | Valid token but insufficient role/permissions     |
| 404    | Requested resource does not exist                 |
| 409    | Conflict — e.g. email already registered          |
| 500    | Unexpected server or database error               |