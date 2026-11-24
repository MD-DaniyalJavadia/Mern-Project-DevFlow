# DevFlow — Phase 3 Authentication

Phase 3 connects the React frontend to the Phase 2 Express authentication API and replaces the mocked login with real registration/login/session handling.

## Authentication implementation

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Current session: `GET /api/auth/me`
- Logout: `POST /api/auth/logout`
- JWT is stored in an **HttpOnly cookie**, not localStorage.
- Cookie uses `SameSite=Lax`; production also enables `Secure`.
- Axios sends cookies using `withCredentials: true`.
- Passwords are hashed with bcrypt on the server.
- Passwords are never returned in API responses.
- Protected routes redirect unauthenticated users to `/login`.
- A browser refresh validates the cookie through `/api/auth/me`.

## Run backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/devflow
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start:

```bash
npm run dev
```

## Run frontend

From the project root:

```bash
npm install
npm run dev
```

Optional `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Test checklist

1. Open `/register`.
2. Register a new account with an 8+ character password.
3. Confirm the dashboard opens automatically.
4. Refresh the browser and confirm the user remains authenticated.
5. Open `/login` after logging out and sign in again.
6. Try a wrong password and verify the server error is displayed.
7. Open `/dashboard` in a logged-out browser and verify it redirects to `/login`.
8. Verify the browser does not expose the JWT through `localStorage`.
9. Logout and verify the session cookie is cleared.
10. Confirm the backend `User` document contains a bcrypt hash rather than the original password.

## Note

The authentication API now uses HttpOnly cookies for the JWT. This is safer than exposing the JWT to JavaScript/localStorage. For a production deployment, HTTPS and an appropriate CSRF strategy should also be enabled/configured.
