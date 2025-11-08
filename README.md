# Donation Campaign App

Modern full-stack donation management platform with user authentication and personal item tracking.

Now includes a full CRUD interface for user-specific Items (e.g. pledges, resources, donation entries) and an About page describing the platform mission.

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
      models/{User.js,Item.js}
      routes/{auth.js,items.js}
      controllers/{authController.js,itemController.js}
      middleware/authMiddleware.js
      utils/jwt.js
  frontend/
    src/pages/{Login,Signup,Dashboard,About}.jsx
    src/services/api.js (fetch helper + ItemsAPI/AuthAPI)
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

## Item CRUD API
Authenticated endpoints (Authorization: Bearer <token>):

- `GET /api/items` — List items for current user (sorted newest first)
- `POST /api/items` — Create item `{ title, description?, amount }` (amount >= 0)
- `GET /api/items/:id` — Fetch single item owned by user
- `PUT /api/items/:id` — Update one or more fields `{ title?, description?, amount? }`
- `DELETE /api/items/:id` — Remove item

Item Schema:
```js
{
  title: String (required),
  description: String,
  amount: Number (>=0),
  createdBy: ObjectId<User>,
  createdAt, updatedAt
}
```

## Dashboard UI (Items)
The Dashboard now shows:
- Profile summary cards
- Item create/edit form (inline, switches to edit mode when selecting an item)
- Responsive grid list of items with amount highlighting and edit/delete actions
 - Page-level background image via `public/assets/dashboard-bg.jpg` with subtle overlay

## About Page
Accessible via navigation bar. Communicates mission, values, and promise. Built with responsive modern layout and gradient typography. Background image uses `public/assets/about-bg.jpg` with a soft dark overlay for readability.

## Testing Signup/Login
1. Navigate to http://localhost:3000
2. Click Signup, create a user
3. Should redirect to Dashboard and show user JSON
4. Logout -> Login with same credentials -> Dashboard
5. Add items in the Dashboard form. Edit and delete to verify CRUD operations.

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

### Quick Local Smoke Test (after cloning)
```bash
# Backend
cd backend
npm install
npm run dev &

# Frontend (in another shell)
cd frontend
npm install
npm run dev
```
Visit http://localhost:3000, register, then open Dashboard to add items.

## Assets (Background Images)
Place images in `frontend/public/assets` with these names:

- `dashboard-bg.jpg` — Dashboard background
- `login-bg.jpg` — Login and Signup background
- `about-bg.jpg` — About page background

These are served statically by Vite/Nginx at `/assets/*.jpg`. Use large, optimized images; content should leave room for text for maximum readability.

## Security Considerations (for future improvements)
- Move JWT to HTTP-only cookie to mitigate XSS
- Add input validation (e.g. zod / joi)
- Rate limiting & helmet middleware
- Password reset & email verification flows

## Next Steps (Optional Enhancements)
-- Donation campaign models (Campaign, Donation) linking Items to Campaigns
- Role-based access (admin, donor)
- File/image uploads (campaign banners) via S3 / Cloudinary
- Pagination & search
- Docker multi-stage for backend (builder + prod) if adding TS/build step
 - Data export and analytics (CSV/Excel)
 - Optimistic UI updates + skeleton loaders
 - Replace inline styles with Tailwind or CSS Modules

---
This scaffold provides a baseline to extend the platform. Let me know if you want to proceed with campaign features or security hardening next.
