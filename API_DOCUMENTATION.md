# Task Manager API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000/api/v1`  
**Auth:** Bearer Token (JWT) — pass in the `Authorization` header as `Bearer <token>`

An interactive Swagger UI is available at `http://localhost:3000/api-docs` once the server is running.

---

## Authentication

### POST `/auth/register`

Create a new user account.

**Request body:**
```json
{
  "name": "Rishabh",
  "email": "rishabh@example.com",
  "password": "secret123"
}
```

**Success response `200`:**
```json
{
  "token": "<jwt_token>"
}
```

**Error responses:**
- `400` — Validation failed (e.g. name too short, invalid email, password < 6 chars)
- `400` — `{ "message": "User Already Exists." }`

---

### POST `/auth/login`

Log in with email and password.

**Request body:**
```json
{
  "email": "rishabh@example.com",
  "password": "secret123"
}
```

**Success response `200`:**
```json
{
  "token": "<jwt_token>"
}
```

**Error responses:**
- `400` — `{ "message": "Invalid Creds!" }`

---

### POST `/auth/google`

Log in or register using a Google ID token (from Google One Tap / OAuth flow on the frontend).

**Request body:**
```json
{
  "credential": "<google_id_token>"
}
```

**Success response `200`:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "...",
    "name": "Rishabh",
    "email": "rishabh@example.com",
    "role": "user"
  }
}
```

**Error responses:**
- `400` — `{ "message": "Google token nahi mila" }`

---

### GET `/auth/me`

Returns the currently authenticated user's profile. Requires a valid JWT.

**Headers:** `Authorization: Bearer <token>`

**Success response `200`:**
```json
{
  "user": {
    "_id": "...",
    "name": "Rishabh",
    "email": "rishabh@example.com",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error responses:**
- `401` — No token / invalid token

---

## Tasks

All task routes require a valid JWT (`Authorization: Bearer <token>`). Users can only access their own tasks.

### GET `/tasks`

Get all tasks for the authenticated user. Supports optional query filters.

**Query params:**

| Param      | Type   | Options                      | Description              |
|------------|--------|------------------------------|--------------------------|
| `status`   | string | `todo`, `in progress`, `done`| Filter by status         |
| `priority` | string | `low`, `medium`, `high`      | Filter by priority       |
| `q`        | string | any                          | Search title/description |

**Success response `200`:**
```json
{
  "tasks": [
    {
      "_id": "...",
      "user": "...",
      "title": "Finish assignment",
      "description": "",
      "status": "todo",
      "priority": "high",
      "dueDate": null,
      "completedAt": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### POST `/tasks`

Create a new task.

**Request body:**
```json
{
  "title": "Finish assignment",
  "description": "Complete the backend internship task",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-04-01"
}
```

Only `title` is required. All other fields are optional and will fall back to their schema defaults (`status: "todo"`, `priority: "medium"`).

**Success response `201`:**
```json
{
  "_id": "...",
  "user": "...",
  "title": "Finish assignment",
  "status": "todo",
  "priority": "high",
  ...
}
```

**Error responses:**
- `400` — `{ "errors": [...] }` (validation failed)

---

### GET `/tasks/:id`

Get a single task by ID. The task must belong to the authenticated user.

**Success response `200`:**
```json
{
  "_id": "...",
  "title": "Finish assignment",
  ...
}
```

**Error responses:**
- `404` — `{ "message": "Task not found" }`

---

### PUT `/tasks/:id`

Update a task. Only fields provided in the body are updated.

**Request body (all optional):**
```json
{
  "title": "Updated title",
  "status": "in progress",
  "priority": "low",
  "dueDate": "2025-05-01"
}
```

If `status` is changed to `"done"`, the server automatically sets `completedAt` to the current timestamp.

**Success response `200`:** Returns the updated task object.

**Error responses:**
- `404` — `{ "message": " Task not Found " }`

---

### DELETE `/tasks/:id`

Delete a task. The task must belong to the authenticated user.

**Success response `200`:** Returns the deleted task object.

**Error responses:**
- `404` — `{ "message": "Task not Found" }`

---

## Admin

All admin routes require a valid JWT **and** the `admin` role. A `403` is returned if a regular user tries to access these.

### GET `/admin/users`

List all registered users (passwords excluded).

**Success response `200`:**
```json
{
  "success": true,
  "count": 3,
  "data": [ { "_id": "...", "name": "...", "email": "...", "role": "user" }, ... ]
}
```

---

### GET `/admin/users/:id`

Get a specific user along with all their tasks.

**Success response `200`:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "...", "email": "...", "role": "user" },
    "tasks": [ ... ]
  }
}
```

**Error responses:**
- `404` — `{ "success": false, "message": "User not found" }`

---

### PATCH `/admin/users/:id/role`

Change a user's role to either `"user"` or `"admin"`.

**Request body:**
```json
{
  "role": "admin"
}
```

**Success response `200`:**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": { ... }
}
```

**Error responses:**
- `400` — Invalid role value
- `404` — User not found

---

### DELETE `/admin/users/:id`

Delete a user and all of their associated tasks.

**Success response `200`:**
```json
{
  "success": true,
  "message": "User and all associated tasks deleted"
}
```

---

### GET `/admin/tasks`

Get all tasks across all users, with the task owner's name, email, and role populated.

**Success response `200`:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "...",
      "title": "...",
      "status": "done",
      "user": { "name": "Rishabh", "email": "...", "role": "user" }
    }
  ]
}
```

---

### DELETE `/admin/tasks/:id`

Delete any task regardless of which user owns it.

**Success response `200`:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Health Check

### GET `/health`

Quick ping to verify the server is up.

**Success response `200`:**
```json
{
  "message": "server is up and running"
}
```

---

## Error Handling

All errors follow a consistent shape:

```json
{
  "message": "Human-readable error description"
}
```

Validation errors include an additional `errors` array:
```json
{
  "message": "First error message",
  "errors": [
    { "field": "email", "msg": "Please enter a valid email" }
  ]
}
```

| Status | Meaning                              |
|--------|--------------------------------------|
| `400`  | Bad request / validation error       |
| `401`  | Missing or invalid JWT               |
| `403`  | Authenticated but insufficient role  |
| `404`  | Resource not found                   |
| `500`  | Unexpected server error              |

---

## Data Models

### User
| Field       | Type     | Notes                          |
|-------------|----------|--------------------------------|
| `_id`       | ObjectId |                                |
| `name`      | String   | Required                       |
| `email`     | String   | Unique, lowercase              |
| `password`  | String   | Bcrypt-hashed, optional for Google users |
| `googleId`  | String   | Populated on Google OAuth      |
| `role`      | String   | `"user"` (default) or `"admin"` |
| `createdAt` | Date     | Auto                           |
| `updatedAt` | Date     | Auto                           |

### Task
| Field         | Type     | Notes                                  |
|---------------|----------|----------------------------------------|
| `_id`         | ObjectId |                                        |
| `user`        | ObjectId | Ref to User                            |
| `title`       | String   | Required                               |
| `description` | String   |                                        |
| `status`      | String   | `todo` / `in progress` / `done`        |
| `priority`    | String   | `low` / `medium` / `high`             |
| `dueDate`     | Date     |                                        |
| `completedAt` | Date     | Auto-set when status → `"done"`        |
| `createdAt`   | Date     | Auto                                   |
| `updatedAt`   | Date     | Auto                                   |
