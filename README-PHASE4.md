# DevFlow — Phase 4: Tasks API Integration

Phase 4 replaces the Tasks page dummy data with the real Express/MongoDB Tasks API.

## What changed

### Frontend
- Added API calls through the central Axios client.
- GET `/api/tasks` loads the authenticated user's tasks.
- POST `/api/tasks` creates tasks.
- PUT `/api/tasks/:id` edits tasks.
- PUT `/api/tasks/:id` toggles completion.
- DELETE `/api/tasks/:id` deletes tasks.
- Search, status filtering and sorting now operate on API-loaded tasks.
- Create/Edit modal uses real form values.
- Loading, empty and API error states added.
- Delete confirmation added.
- Dashboard task list/statistics now reads task data from the backend.

### Backend
The existing protected task routes and Mongoose Task model from Phase 2/3 are used:

GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id

All task queries are scoped to `req.user._id` through the authenticated middleware/controller.

## Run

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
npm install
npm run dev
```

Make sure `.env` contains:

```env
VITE_API_URL=http://localhost:5000/api
```

Backend `.env` should contain a valid MongoDB URI, JWT secret, port and frontend origin.

## Test checklist

1. Register/login.
2. Open Tasks.
3. Create a task.
4. Verify it appears after creation.
5. Refresh the browser and verify it remains.
6. Edit the task.
7. Toggle Completed/Todo.
8. Search the task.
9. Filter by status.
10. Sort by title and due date.
11. Delete the task.
12. Confirm the dashboard reflects the API task counts.
13. Log in as another user and verify the first user's tasks are not visible.
