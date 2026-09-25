# Bridge — Job Portal

A full-stack job portal: employers post jobs, job seekers search and apply.

- **Backend:** Node.js, Express, MySQL (`mysql2`), bcrypt password hashing
- **Frontend:** React (Vite), React Router, Axios
- **Auth:** simple email/password login. The logged-in user's id, name and
  role are kept in the browser's `localStorage` (no JWT — matches a
  straightforward course-project scope, easy to upgrade later).

```
Job-Portal-O/
├── backend/     Express API + MySQL
└── frontend/    React app (Vite)
```

## 1. Prerequisites

- Node.js 18+ and npm
- MySQL 8+ (or MariaDB) running locally, or a hosted MySQL instance

## 2. Set up the database

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates a `job_portal` database with three tables: `users`, `jobs`,
`applications`.

## 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=job_portal
DB_PORT=3306
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

Run it:

```bash
npm run dev       # with nodemon (auto-restart)
# or
npm start
```

You should see `✅ Connected to MySQL database` and
`🚀 Server running on http://localhost:5000`.

## 4. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env` just needs the backend's URL:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 5. Try it out

1. Sign up as an **Employer**, post a job.
2. Sign up (in another browser / incognito tab) as a **Job seeker**, search
   for it on the Jobs page, and apply.
3. Check **My applications** as the seeker, and **Dashboard → Applicants**
   as the employer.

## API reference

| Method | Route                              | Description                        |
|--------|-------------------------------------|-------------------------------------|
| POST   | `/api/register`                    | Create an account (seeker/employer) |
| POST   | `/api/login`                       | Log in                              |
| GET    | `/api/jobs?search=&location=`      | List/search jobs                    |
| GET    | `/api/jobs/employer/:employerId`   | Jobs posted by one employer         |
| POST   | `/api/jobs`                        | Post a job (employer)               |
| DELETE | `/api/jobs/:id`                    | Remove a job posting                |
| POST   | `/api/apply`                       | Apply to a job (seeker)             |
| GET    | `/api/applications/user/:userId`   | A seeker's applications             |
| GET    | `/api/applications/job/:jobId`     | Applicants for a job (employer)     |

## Deploying

A simple free-tier-friendly setup:

- **Database:** a managed MySQL instance (Railway, Aiven, PlanetScale-compatible
  alternative, or Clever Cloud all have free/cheap MySQL tiers).
- **Backend:** deploy the `backend/` folder to Railway, Render, or Fly.io.
  Set the same environment variables as your local `.env` (`DB_HOST`,
  `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `PORT`, and `CORS_ORIGIN`
  set to your deployed frontend's URL).
- **Frontend:** deploy the `frontend/` folder to Vercel or Netlify. Set the
  `VITE_API_URL` environment variable to your deployed backend's URL, e.g.
  `https://your-api.onrender.com/api`.

Rebuild/redeploy the frontend whenever `VITE_API_URL` changes, since Vite
bakes env vars in at build time.

## Notes on the design

Visual identity: a warm paper background with a deep forest-teal primary
and a warm amber accent, Fraunces for headings and Inter for UI text —
meant to feel more like a considered product than a generic admin-panel
template. Colors and type live as CSS variables at the top of
`frontend/src/index.css` if you want to restyle it.
