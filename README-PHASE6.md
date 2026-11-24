# DevFlow — Phase 6

## Coding Sessions + Bookmarks API integration

Phase 6 connects Coding Sessions and Bookmarks to the existing authenticated Node.js/MongoDB backend.

### Coding Sessions
- Load saved sessions from `GET /api/sessions`
- Start / pause timer locally
- Stop & Save sends `POST /api/sessions`
- Reset clears an unsaved timer
- Today's time, last-7-days time and completed session count are calculated from MongoDB data
- Recent sessions list is loaded from the API
- User isolation is enforced by JWT middleware

### Bookmarks
- `GET /api/bookmarks`
- `POST /api/bookmarks`
- `PUT /api/bookmarks/:id`
- `DELETE /api/bookmarks/:id`
- Search and category filter
- Create/edit modal
- URL validation
- Delete confirmation
- Loading, empty and error states
- External links open in a new tab

### Run
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

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Test
1. Login.
2. Open Coding Sessions.
3. Start → Pause → Start → Stop & Save.
4. Refresh and verify the saved session remains.
5. Verify today's and 7-day totals.
6. Create, edit, search, filter and delete a bookmark.
7. Open a bookmark URL in a new tab.
8. Login with another account and verify sessions/bookmarks are isolated.
