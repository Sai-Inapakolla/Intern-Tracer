# Internship Tracker (Full Stack)

A pure full-stack Internship Tracker application using:

- Frontend: Angular
- Backend: Node.js + Express + TypeScript
- Database: MongoDB

## Project Structure

- `frontend/` Angular SPA for internship tracking UI
- `backend/` REST API for internship application CRUD + resume upload

## Run Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:3000`.

## Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`.

## API Endpoints

- `GET /api/applications`
- `GET /api/applications/:id`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`
- `POST /api/applications/upload`

## Build

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

## Author & Contributor

- **[Sai-Inapakolla](https://github.com/Sai-Inapakolla)**


