# Internship Tracker Backend

Node.js + Express + MongoDB backend for the Internship Tracker Angular frontend.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` and `PORT`.
3. Install packages:

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## API

- `GET /api/applications`
- `GET /api/applications/:id`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`
- `POST /api/applications/upload` (multipart with `resume` field)
