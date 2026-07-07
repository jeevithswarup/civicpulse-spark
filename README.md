# CivicPulse Frontend

Modern, role-based civic complaint management frontend built with React, TypeScript, and TanStack Router. Connects to a Django REST Framework backend.

## Tech Stack

- **Framework**: React 19, TypeScript
- **Routing**: TanStack Router (file-based)
- **Styling**: Tailwind CSS, shadcn/ui components
- **State**: React Query for server state
- **Auth**: JWT (SimpleJWT from Django backend)
- **Build**: Vite

## Project Structure

```
src/
├── routes/               # File-based routes (TanStack Router)
│   ├── login.tsx         # Login page (all roles)
│   ├── register.tsx      # Citizen registration
│   ├── citizen.*         # Citizen dashboard, complaints, report
│   ├── officer.*         # Officer dashboard, complaint management
│   ├── worker.*          # Worker task views
│   └── admin.*           # Admin dashboards
├── lib/
│   ├── api/
│   │   ├── client.ts     # Base fetch wrapper with JWT auth
│   │   ├── auth.ts       # Authentication APIs
│   │   └── complaints.ts # Complaint CRUD & role-specific APIs
│   └── utils.ts          # Tailwind cn helper
├── components/civic/     # Reusable UI components
└── data/                 # Navigation configs, mock data

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/jeevithswarup/civicpulse-spark.git
cd civicpulse-spark
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set VITE_API_URL to your Django backend URL
```

```env
VITE_API_URL=http://localhost:8000
```

### 3. Start the dev server

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

> Make sure the Django backend (`civicpulse-backend`) is running on port 8000 first.

## Backend

Repo: [civicpulse-backend](https://github.com/jeevithswarup/civicpulse-backend)

```bash
cd civicpulse-backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # create an admin user
python manage.py runserver
```

## Roles & Pages

| Role     | Pages |
|----------|-------|
| Citizen  | Dashboard, Report Issue, My Complaints, Complaint Detail, Nearby, Profile |
| Officer  | Dashboard, Complaint Management, Analytics |
| Worker   | Dashboard, Task Detail |
| Admin    | Dashboard, Analytics, Users, Settings |

## API Connection

All API calls go through `src/lib/api/client.ts` which:
- Reads `VITE_API_URL` from environment
- Attaches `Bearer <token>` to every request
- Silently refreshes expired JWT tokens via `POST /api/auth/token/refresh/`
- On unrecoverable 401, clears tokens and redirects to `/login`

### Auth flow
1. User submits login → `POST /api/auth/login/` → gets `access` + `refresh` tokens
2. Tokens stored in `localStorage` as `cp_access` and `cp_refresh`
3. Every API call includes `Authorization: Bearer <access_token>`
4. On 401 → tries `POST /api/auth/token/refresh/` → retries original request
5. Logout → clears all tokens → redirect to `/login`
