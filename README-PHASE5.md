# DevFlow — Phase 5

## Code Snippets, Bug Tracker & Notes API Integration

Phase 5 connects the Snippets, Bugs and Notes frontend pages to the authenticated Express/MongoDB APIs.

### Implemented

- Code Snippets
  - GET, POST, PUT, DELETE
  - Search by title/description/code/tags
  - Filter by language
  - Add/edit/delete modal workflow
  - Copy code to clipboard
  - Loading, empty and API error states

- Bug Tracker
  - GET, POST, PUT, DELETE
  - Search by title/description/project/assignee
  - Filter by status
  - Priority and status editing
  - Add/edit/delete workflow
  - Loading, empty and API error states

- Notes
  - GET, POST, PUT, DELETE
  - Search by title/content/tags
  - Pinned filter
  - Add/edit/delete workflow
  - Pin/unpin through edit form
  - Loading, empty and API error states

### Backend security

The shared CRUD controller now strips `userId` from incoming create/update payloads. The authenticated user's ID is always assigned by the backend, preventing clients from attempting to create or modify records under another user.

### API routes

- `/api/snippets`
- `/api/bugs`
- `/api/notes`

All routes require the Phase 3 authenticated HttpOnly JWT cookie.

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

### Test checklist

1. Register/login.
2. Create, edit and delete a snippet.
3. Search and language-filter snippets.
4. Copy snippet code.
5. Create, edit and delete a bug.
6. Filter bugs by status.
7. Create, edit and delete a note.
8. Pin a note and test the Pinned filter.
9. Refresh each page and verify records persist in MongoDB.
10. Log in as another user and verify records are isolated per account.
