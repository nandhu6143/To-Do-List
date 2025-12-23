# MEAN To-Do List Application

A user-friendly To-Do List application built with the MEAN stack (MongoDB, Express, Angular, Node.js).
This application allows users to organize and manage daily activities efficiently with features for task prioritization and deadlines.

## Features
- **Create Tasks**: Add new tasks with title, description, priority (Low/Medium/High), and due date.
- **Manage Tasks**: Edit task details or delete tasks.
- **Track Progress**: Mark tasks as "Completed" or "Pending".
- **Prioritize**: Visual indicators for task priority.

## Tech Stack
- **Frontend**: Angular (v17+)
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on port 27017

### Backend Setup
1. Navigate to `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm run dev` (Runs on http://localhost:5000)

### Frontend Setup
1. Navigate to `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm start` (Runs on http://localhost:4200)

## API Endpoints
- `GET /api/tasks`: Get all tasks
- `GET /api/tasks/:id`: Get a specific task
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task
