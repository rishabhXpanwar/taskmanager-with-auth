# Task Manager with Authentication

A full-stack Task Management application built with a **Node.js + Express + MongoDB** backend and a **React + Vite** frontend. It features JWT authentication, Google OAuth login, role-based access control (RBAC), task CRUD with filtering, Swagger API documentation, and an Admin dashboard.

---

## 🚀 Features

- 👤 User registration & login (JWT-based)
- 🔑 Google OAuth login/register
- 🔐 Protected routes for authenticated users
- 🛡️ Role-based access control — `user` and `admin` roles
- 🧾 Create, read, update, and delete tasks
- 🔎 Filter tasks by status, priority, or search by title/description
- 📅 Task due dates and completion timestamps
- 🧑‍💼 Admin dashboard — manage users, roles, and all tasks
- 📖 Swagger UI API documentation at `/api-docs`
- 🧠 Input validation using `express-validator`
- 💾 MongoDB with Mongoose
- ⚙️ Environment config with `dotenv`
- 🌐 CORS support for frontend–backend communication
- 🪶 Clean modular code structure (frontend & backend separated)

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js v5 |
| Database | MongoDB (Mongoose) |
| Authentication | JWT, bcryptjs, Google OAuth (`google-auth-library`) |
| Validation | express-validator |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Frontend | React 19, Vite, React Router v7 |
| Google OAuth (FE) | @react-oauth/google |
| HTTP Client | Axios |
| Environment Config | dotenv |

---

## 📁 Folder Structure

```
taskmanager-with-auth/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authcontroller.js
│   │   ├── taskcontroller.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roleMiddleware.js
│   │   └── errorhandler.js
│   ├── models/
│   │   ├── user.js
│   │   └── tasks.js
│   ├── routes/
│   │   ├── authroutes.js
│   │   ├── taskroutes.js
│   │   └── adminRoutes.js
│   ├── seed.js
│   ├── swagger.js
│   ├── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
├── LICENSE
└── Readme.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

---

### 1️⃣ Clone the repository

```bash
git clone https://github.com/rishabhXpanwar/taskmanager-with-auth.git
cd taskmanager-with-auth
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
port=3000
mongoUri=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id_here
```

Start the backend server:

```bash
npm start        # production
npm run dev      # development (nodemon)
```

Backend will be running at 👉 **http://localhost:3000**

Swagger API docs available at 👉 **http://localhost:3000/api-docs**

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at 👉 **http://localhost:5173**

---

## 📖 API Endpoints

All routes are prefixed with `/api/v1`.

### 🔹 Auth Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register a new user | No |
| POST | `/api/v1/auth/login` | Login with email & password | No |
| POST | `/api/v1/auth/google` | Login / register with Google | No |
| GET | `/api/v1/auth/me` | Get logged-in user's profile | ✅ JWT |

#### Register — Body Example

```json
{
  "name": "Rishabh",
  "email": "rishabh@example.com",
  "password": "123456"
}
```

#### Login — Body Example

```json
{
  "email": "rishabh@example.com",
  "password": "123456"
}
```

#### Response Example

```json
{
  "token": "your_jwt_token"
}
```

#### Google Auth — Body Example

```json
{
  "credential": "<google_id_token_from_frontend>"
}
```

---

### 🔹 Task Routes

> All task routes require a valid JWT token in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get all tasks for the logged-in user |
| POST | `/api/v1/tasks` | Create a new task |
| GET | `/api/v1/tasks/:id` | Get a specific task by ID |
| PUT | `/api/v1/tasks/:id` | Update a task |
| DELETE | `/api/v1/tasks/:id` | Delete a task |

#### Query Parameters for GET `/api/v1/tasks`

| Param | Type | Description |
|-------|------|-------------|
| `status` | `todo` \| `in progress` \| `done` | Filter by status |
| `priority` | `low` \| `medium` \| `high` | Filter by priority |
| `q` | string | Search in title or description |

#### Create Task — Body Example

```json
{
  "title": "Finish project",
  "description": "Complete the final report",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

#### Update Task — Body Example

```json
{
  "status": "in progress",
  "priority": "medium"
}
```

---

### 🔹 Admin Routes

> All admin routes require a valid JWT token **and** the `admin` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users` | Get all users |
| GET | `/api/v1/admin/users/:id` | Get a user and their tasks |
| PATCH | `/api/v1/admin/users/:id/role` | Update a user's role |
| DELETE | `/api/v1/admin/users/:id` | Delete a user and all their tasks |
| GET | `/api/v1/admin/tasks` | Get all tasks from all users |
| DELETE | `/api/v1/admin/tasks/:id` | Delete any task |

#### Update Role — Body Example

```json
{
  "role": "admin"
}
```

---

## 🛡️ Role-Based Access Control

| Role | Capabilities |
|------|-------------|
| `user` | Manage their own tasks only |
| `admin` | Access admin dashboard, manage all users & tasks, update roles |

---

## 🌐 Frontend Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Landing page | Public |
| `/login` | Login page | Public |
| `/register` | Register page | Public |
| `/dashboard` | User Dashboard or Admin Dashboard | Authenticated users only |

The `/dashboard` route automatically redirects to the **Admin Dashboard** if the logged-in user has the `admin` role, and to the **User Dashboard** otherwise.

---

## 🧑‍💻 Author

**Rishabh Panwar**

---

## 📄 License

This project is licensed under the **MIT License**.
Feel free to use and modify it as needed.