# Scalability Notes

This document outlines how the Task Manager backend is structured today and the natural paths for scaling it as usage grows.

---

## Where things stand

The current architecture is a single Express server connected to a MongoDB Atlas cluster. It handles authentication, task CRUD, and admin operations in one process. For an early-stage or intern-level project this is exactly the right starting point — it's easy to reason about, easy to deploy, and doesn't introduce operational overhead before it's needed.

That said, the codebase has been written in a way that makes future scaling straightforward. Routes, controllers, models, and middleware are cleanly separated, so pulling any module out into its own service later is a matter of copying a folder rather than untangling a monolith.

---

## Horizontal scaling

The server is stateless. JWT tokens live in the client, not on the server, so multiple instances of the app can run behind a load balancer (NGINX, AWS ALB, etc.) without any session-sharing problem. Spinning up three instances and putting them behind a round-robin load balancer is a zero-code change.

MongoDB Atlas handles read replicas natively, so database read throughput can scale independently of the application tier.

---

## Caching

The most natural place to add caching is the admin `GET /admin/users` and `GET /admin/tasks` endpoints — they're read-heavy and their data doesn't change on every request. Redis would work well here: cache the result with a short TTL (say 30–60 seconds) and invalidate it whenever a user or task is created, updated, or deleted.

For the user-facing task list, caching is trickier since results are per-user and filtered dynamically, but response-level HTTP caching with proper `Cache-Control` headers can still reduce server load for identical repeat requests.

---

## Moving toward microservices

If the product grows to the point where the auth logic and the task logic are being updated by different teams at different cadences, splitting them into separate services is the right move:

- **Auth Service** — handles registration, login, Google OAuth, and token issuance. Other services verify tokens by calling this service or using a shared JWT secret.
- **Task Service** — owns the Task model and all CRUD operations. Receives a verified user ID in request headers after the API gateway validates the token.
- **Admin Service** — a thin read-aggregation service that queries both the user and task collections. Since admin operations are low-frequency, this doesn't need to be highly optimised.

An API gateway (Kong, AWS API Gateway, or even a lightweight Express proxy) sits in front and handles routing, rate limiting, and JWT validation so individual services don't have to repeat that logic.

---

## Message queues and async work

Right now, when a task is marked `"done"` the server sets `completedAt` synchronously in the same request. At scale, operations like sending completion emails, triggering webhooks, or updating analytics could be offloaded to a queue (BullMQ with Redis, or AWS SQS) so the HTTP response stays fast and the heavy work happens in the background.

---

## Database considerations

MongoDB's document model suits this project well because tasks are always fetched by their owning user — there are no complex cross-collection joins in the hot path. A few things worth doing as the dataset grows:

- Add a compound index on `{ user: 1, createdAt: -1 }` in the Task collection so the "get all my tasks" query stays fast even with millions of rows.
- Consider MongoDB Atlas's built-in full-text search for the `q` query parameter rather than the current regex approach, which doesn't use indexes.

---

## Deployment

The project is container-friendly with no major changes. A basic `Dockerfile` wrapping `node server.js` plus a `docker-compose.yml` that brings up the app and a local MongoDB instance covers local development and CI. For production, deploying the container to a managed platform (Railway, Render, ECS, or a plain EC2 instance) with environment variables injected via secrets manager is straightforward.

The `seed.js` script for creating the admin user can be run as a one-off task at deploy time (`node seed.js`) rather than keeping it in the main server boot path, which is the right pattern for initialisation scripts.
