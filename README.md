# Lab Notebook (React + Node + MongoDB)

## Requirements
- Node.js 18+
- MongoDB running locally (or an Atlas URI in Backend/.env)

## Run
Terminal 1 (API):
    cd Backend
    npm install
    npm start

Terminal 2 (UI):
    cd Frontend
    npm install
    npm run dev

Open http://localhost:3000

## API
GET    /api/entries
POST   /api/entries        { title, notes }
PUT    /api/entries/:id    { title?, notes?, done? }
DELETE /api/entries/:id
