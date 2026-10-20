# Employee Management System (Django + React)

Full-stack EMS: Django REST Framework API backend + React frontend (JWT auth).

## Features
- JWT login (access + refresh tokens, auto-refresh on expiry)
- Employee CRUD: personal info, department, designation, manager, salary, status
- Departments & Designations management
- Leave requests with approve/reject workflow
- Dashboard with live stats (headcount, by department, pending leaves)
- Search, filtering, ordering, and pagination on the employee list
- Django admin panel for power-user data management

## Project Structure
```
ems-project/
├── backend/                 # Django REST API
│   ├── ems/                 # project settings, urls
│   ├── employees/           # app: models, serializers, views, urls, admin
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/                 # React app
    ├── src/
    │   ├── api/axios.js      # axios instance + JWT refresh interceptor
    │   ├── context/AuthContext.js
    │   ├── components/       # Layout, ProtectedRoute
    │   └── pages/            # Login, Dashboard, EmployeeList, EmployeeForm, Departments, LeaveRequests
    ├── package.json
    └── .env.example
```

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # edit SECRET_KEY etc.

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API runs at `http://localhost:8000`. Admin panel at `/admin/`.

Sample endpoints:
- `POST /api/auth/login/` — get access + refresh tokens
- `POST /api/auth/refresh/`
- `GET/POST /api/employees/`
- `GET/PUT/PATCH/DELETE /api/employees/{id}/`
- `GET /api/employees/dashboard_stats/`
- `GET/POST /api/departments/`
- `GET/POST /api/designations/`
- `GET/POST /api/leave-requests/`
- `POST /api/leave-requests/{id}/approve/`
- `POST /api/leave-requests/{id}/reject/`
- `GET /api/me/`

To create a department/designation quickly for testing, use Django admin or the `/api/departments/` and `/api/designations/` POST endpoints.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env            # point REACT_APP_API_URL at your backend
npm start
```

App runs at `http://localhost:3000` and logs in against the Django API.

## Notes
- Default DB is SQLite for quick local dev; switch to Postgres by setting `DB_*` env vars in `backend/.env` (see comments in `.env.example`).
- CORS is pre-configured to allow `http://localhost:3000`.
- For production: set `DEBUG=False`, a strong `SECRET_KEY`, proper `ALLOWED_HOSTS`, serve React as a static build (`npm run build`) behind Nginx or WhiteNoise, and put Django behind Gunicorn.

## Deploy to Render

This repository includes a `render.yaml` Blueprint that deploys the React app and Django API together at one public URL.

1. Create a GitHub repository and push this `ems-project` folder to it.
2. In Render, select **New → Blueprint**, connect the GitHub repository, and apply the detected Blueprint.
3. Set `DEMO_ADMIN_PASSWORD` to a strong password in Render when prompted. Render generates the production `SECRET_KEY` and provisions PostgreSQL automatically.
4. When the deployment completes, open the generated `https://<service-name>.onrender.com` URL and sign in with username `demo` and the password you chose.

Each deploy builds the frontend, applies migrations, and seeds the 30-person demo dataset. Do not use the demo account for sensitive client data.
