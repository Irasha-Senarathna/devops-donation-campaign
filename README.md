# Donation Campaign App

Basic full-stack scaffold with authentication (JWT) using:
- Backend: Node.js + Express + MongoDB (Mongoose)
- Frontend: React + React Router + Vite build served by Nginx container
- Database: MongoDB (container), accessible via MongoDB Compass
- Auth: Email/password with hashed passwords (bcrypt) + JWT tokens stored in localStorage (demo purposes)

## Project Structure
```
donation-campaign/
  docker-compose.yml
  backend/
    server.js
    src/
      models/User.js
      routes/auth.js
      controllers/authController.js
      middleware/authMiddleware.js
      utils/jwt.js
  frontend/
    src/pages/{Login,Signup,Dashboard}.jsx
```

## Environment Variables
Backend expects:
- `MONGO_URI` (already provided in compose)
- `PORT` (default 5000)
- `JWT_SECRET` (set in compose - CHANGE IN PRODUCTION)

You can override by creating a `.env` file in `backend/` (not committed) and adding the same keys. Docker compose currently sets them directly for simplicity.

## Running with Docker
```bash
# From project root
docker compose up --build
```
Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017 (for Compass)

Compose mounts a named volume for Mongo persistence: `mongo-data`.

## Using MongoDB Compass
1. Open Compass
2. New connection string: `mongodb://localhost:27017`
3. Connect, find database `donation_db`
4. Users will be stored in collection `users`

## Auth Flow
Endpoints:
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/me` Authorization: Bearer <token>

Passwords are hashed with bcrypt (salt rounds=10). JWT expiry is 7 days.

## Testing Signup/Login
1. Navigate to http://localhost:3000
2. Click Signup, create a user
3. Should redirect to Dashboard and show user JSON
4. Logout -> Login with same credentials -> Dashboard

## Development Notes
- Frontend dev mode (outside Docker):
  ```bash
  cd frontend
  npm install
  npm run dev
  # Vite dev server -> http://localhost:3000
  ```
  Vite dev server proxies `/api` to the backend per `vite.config.js`.
- Production build output goes to `frontend/dist` (copied into Nginx image).
- Backend dev mode:
  ```bash
  cd backend
  npm install
  npm run dev
  ```
  Ensure a Mongo instance is available locally or use the one from Docker compose (adjust `MONGO_URI`).

## Security Considerations (for future improvements)
- Move JWT to HTTP-only cookie to mitigate XSS
- Add input validation (e.g. zod / joi)
- Rate limiting & helmet middleware
- Password reset & email verification flows

## Next Steps (Optional Enhancements)
- Donation campaign models (Campaign, Donation)
- Role-based access (admin, donor)
- File/image uploads (campaign banners) via S3 / Cloudinary
- Pagination & search
- Docker multi-stage for backend (builder + prod) if adding TS/build step

---
This scaffold provides a baseline to extend the platform. Let me know if you want to proceed with campaign features or security hardening next.
