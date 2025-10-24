Task Manager with Authentication (Node.js + MongoDB)

A full-featured Task Management API built using Node.js, Express, and MongoDB, featuring JWT authentication, task CRUD operations, and role-based route protection.

🚀 Features

👤 User registration & login (JWT based)

🔐 Protected routes for authenticated users

🧾 Create, update, delete, and view tasks

🧠 Input validation using express-validator

💾 MongoDB database connection with Mongoose

⚙️ Environment variables with dotenv

🪶 Clean folder structure and modular code

🧰 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT, bcrypt

Validation: express-validator

Environment Config: dotenv

⚙️ Installation & Setup : 

1️⃣ Clone this repository
git clone https://github.com/rishabhXpanwar/taskmanager-with-auth.git

2️⃣ Navigate into the project directory
cd taskmanager-with-auth

3️⃣ Install dependencies
npm install

4️⃣ Create a .env file in the root directory and add:
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.8
JWT_SECRET=rishabh12345
JWT_EXPIRES_IN=7d

5️⃣ Start the server
npm start or npm run dev


Server will start at 👉 http://localhost:3000

API Endpoints
🔹 Auth Routes
➤ Register User

POST /api/auth/register

Body Example:

{
  "username": "rishabh",
  "email": "rishabh@example.com",
  "password": "123456"
}

➤ Login User

POST /api/auth/login

Body Example:

{
  "email": "rishabh@example.com",
  "password": "123456"
}


Response Example:

{
  "token": "your_jwt_token"
}

🔹 Task Routes

(All below routes are protected — require JWT token in headers.)

➤ Create Task

POST /api/tasks

{
  "title": "Finish project",
  "status": "todo",
  "priority": "high"
}

➤ Get All Tasks

GET /api/tasks

➤ Get Task by ID

GET /api/tasks/:id

➤ Update Task

PUT /api/tasks/:id

{
  "status": "in progress",
  "priority": "medium"
}

➤ Delete Task

DELETE /api/tasks/:id

🧠 Folder Structure
taskmanager-with-auth/
│
├── controllers/
│   ├── authController.js
│   └── taskController.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   └── Task.js
│
├── routes/
│   ├── authRoutes.js
│   └── taskRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md

🧑‍💻 Author

Rishabh Panwar



 License

This project is licensed under the MIT License.
Feel free to use and modify it as needed.