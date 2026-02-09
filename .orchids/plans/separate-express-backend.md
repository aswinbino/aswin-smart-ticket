# Restructure to Separate Express Backend

## Requirements
Move the current Next.js API routes into a standalone Express.js server in a `/server` folder with a traditional MERN-style backend architecture, while keeping the Next.js frontend and PostgreSQL/Supabase database.

## Current State Analysis

### Existing Backend (Next.js API Routes)
```
src/app/api/
├── auth/
│   ├── register/route.ts   → POST /api/auth/register
│   ├── login/route.ts      → POST /api/auth/login
│   └── me/route.ts         → GET /api/auth/me
├── tickets/
│   ├── route.ts            → GET/POST /api/tickets
│   └── [id]/route.ts       → GET/PUT/DELETE /api/tickets/:id
└── admin/
    └── users/route.ts      → GET /api/admin/users
```

### Existing Utilities
- `src/lib/auth.ts` — JWT sign/verify, authenticate middleware
- `src/lib/supabase.ts` — Supabase client for PostgreSQL
- `src/lib/auth-context.tsx` — Frontend auth state management

### Database
- PostgreSQL via Supabase (keeping this)
- Tables: `users`, `tickets`

## Architecture Decision

**Decision**: Create a separate Express.js server in `/server` that:
1. Uses the same PostgreSQL/Supabase database
2. Mirrors the existing API structure
3. Runs on port 5000 during development
4. Frontend proxies API calls to the Express server

### Project Structure After Restructure
```
/
├── server/                    # NEW: Express backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── src/
│   │   ├── index.ts          # Express entry point
│   │   ├── config/
│   │   │   └── db.ts         # Supabase connection
│   │   ├── middleware/
│   │   │   └── auth.ts       # JWT auth middleware
│   │   ├── routes/
│   │   │   ├── auth.ts       # /api/auth routes
│   │   │   ├── tickets.ts    # /api/tickets routes
│   │   │   └── admin.ts      # /api/admin routes
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── ticketController.ts
│   │   │   └── adminController.ts
│   │   └── types/
│   │       └── index.ts      # TypeScript interfaces
│   └── README.md
│
├── src/                       # Frontend (Next.js - modified)
│   ├── app/
│   │   ├── api/              # REMOVED
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── ...
│   └── lib/
│       ├── auth-context.tsx  # Updated API URLs
│       └── ...
│
├── package.json              # Root package.json (workspace or scripts)
└── .env                      # Shared env vars
```

## Implementation Phases

### Phase 1: Create Express Server Structure
- Create `/server` directory with package.json
- Install dependencies: express, cors, bcrypt, jsonwebtoken, @supabase/supabase-js
- Set up TypeScript configuration
- Create entry point `server/src/index.ts`

### Phase 2: Migrate Database Config
- Create `server/src/config/db.ts` with Supabase client
- Copy connection logic from `src/lib/supabase.ts`

### Phase 3: Migrate Auth Middleware
- Create `server/src/middleware/auth.ts`
- Convert Next.js auth helpers to Express middleware
- Implement `authenticate` and `authorizeAdmin` middleware functions

### Phase 4: Create Auth Routes & Controller
- Create `server/src/controllers/authController.ts` with register, login, me functions
- Create `server/src/routes/auth.ts` with route definitions
- Migrate logic from `src/app/api/auth/*/route.ts`

### Phase 5: Create Ticket Routes & Controller
- Create `server/src/controllers/ticketController.ts`
- Create `server/src/routes/tickets.ts`
- Migrate logic from `src/app/api/tickets/route.ts` and `[id]/route.ts`
- Implement: getTickets, createTicket, getTicketById, updateTicket, deleteTicket

### Phase 6: Create Admin Routes & Controller
- Create `server/src/controllers/adminController.ts`
- Create `server/src/routes/admin.ts`
- Migrate logic from `src/app/api/admin/users/route.ts`

### Phase 7: Update Frontend API Calls
- Update `src/lib/auth-context.tsx` to use configurable API base URL
- Create environment variable `NEXT_PUBLIC_API_URL=http://localhost:5000`
- Update all fetch calls in dashboard and admin pages

### Phase 8: Remove Next.js API Routes
- Delete `src/app/api/` directory entirely
- Remove server-only dependencies from frontend package.json if unused elsewhere

### Phase 9: Setup Development Scripts
- Add concurrent dev script to run both servers
- Update root package.json with workspace scripts
- Create `.env.example` files for both frontend and backend

## API Endpoints (Express)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get current user | Required |
| GET | /api/tickets | List tickets | Required |
| POST | /api/tickets | Create ticket | Required |
| GET | /api/tickets/:id | Get single ticket | Required |
| PUT | /api/tickets/:id | Update ticket | Required |
| DELETE | /api/tickets/:id | Delete ticket | Required |
| GET | /api/admin/users | List all users | Admin |

## Dependencies

### Server Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "@supabase/supabase-js": "^2.95.3",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "nodemon": "^3.0.2"
  }
}
```

## Environment Variables

### Server (.env)
```
PORT=5000
SUPABASE_URL=<from current .env>
SUPABASE_SERVICE_ROLE_KEY=<from current .env>
JWT_SECRET=<from current .env>
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Testing Strategy
1. Start Express server on port 5000
2. Test each endpoint with curl/Postman
3. Start Next.js frontend
4. Verify full flow: register → login → create ticket → view tickets

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| CORS issues | Configure cors middleware properly with frontend origin |
| Environment variable sync | Use shared .env in root or document clearly |
| Breaking existing functionality | Test each endpoint before removing Next.js routes |
| Development complexity | Use concurrently to run both servers with one command |
