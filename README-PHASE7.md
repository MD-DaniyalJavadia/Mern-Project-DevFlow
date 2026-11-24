# DevFlow — Phase 7: Analytics

## Included

Phase 7 connects the Analytics page and Dashboard productivity widgets to the authenticated `/api/analytics` endpoint.

### Analytics API

`GET /api/analytics`

Returns user-scoped:
- total tasks
- completed tasks
- pending tasks
- open bugs
- resolved bugs
- total coding seconds/hours
- weekly coding hours, completed tasks, and resolved bugs
- monthly productivity by week

### Frontend

- Analytics KPI cards now use MongoDB data.
- Weekly productivity chart uses completed tasks and resolved bugs from the API.
- Monthly productivity view is available from the period selector.
- Coding-hours chart uses real CodingSession data.
- Dashboard task statistics use the analytics API.
- Dashboard coding-hours chart uses the current week's real session data.
- Dashboard shows live Open Bugs instead of dummy values.
- Loading and API error states are included.

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

Frontend environment:

```env
VITE_API_URL=http://localhost:5000/api
```

## Test

1. Login with a registered user.
2. Create/complete tasks and resolve bugs.
3. Save coding sessions.
4. Open Dashboard and confirm live counts/charts.
5. Open Analytics and switch Weekly/Monthly.
6. Refresh and confirm values persist from MongoDB.
7. Login with another account and verify analytics are user-specific.

## Validation

Backend JavaScript syntax was checked with `node --check`.
The full Vite production build was not run in the generation environment because frontend npm dependencies were not installed/cached there.
