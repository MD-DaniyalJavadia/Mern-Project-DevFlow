# DevFlow — Phase 2 Backend

## Backend
cd backend
copy .env.example .env
# set MONGODB_URI and JWT_SECRET
npm install
npm run dev

API: http://localhost:5000/api
Health: http://localhost:5000/api/health

## Frontend
cd ..
npm install
npm run dev

The Phase 1 UI remains mock-data based in this phase. The Axios client is prepared with JWT Authorization support. Full feature-by-feature frontend API wiring starts in Phase 4.
