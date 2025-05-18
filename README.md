# Career Snap:

Career Snap is a full-stack web application that helps users track their professional development, job applications, and career goals. The project leverages a modern frontend and a lightweight backend to provide a seamless and interactive experience.

## Key Features:

-Frontend landing page served at (http://localhost:5173)

-Track job applications with status updates

-Filter and search job entries

-Dashboard-style layout with user-friendly UI

-Backend API using Express and MongoDB for secure data handling

## Technical Stack:

### Frontend

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- HTML, CSS, JavaScript
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose

### Development Tools

- Axios
- ESLint
- dotenv
- CORS
- Nodemon

## Backend API Overview

**Base URL:** `http://localhost:5000/api`

| Method | Endpoint    | Description              |
| ------ | ----------- | ------------------------ |
| GET    | `/jobs`     | Retrieve all job entries |
| POST   | `/jobs`     | Create a new job entry   |
| PUT    | `/jobs/:id` | Update a job entry       |
| DELETE | `/jobs/:id` | Delete a job entry       |

## Additional Tools & Libraries

- **Axios** – for frontend-backend HTTP communication
- **React Router** – for smooth page navigation
- **Mongoose** – for MongoDB data modeling
- **ESLint** – for maintaining clean, consistent code

---

## Why These Technologies?

- **React + Vite**: Fast, responsive frontend development
- **Express**: Simple and flexible API structure
- **MongoDB**: NoSQL database ideal for job entries
- **Vite**: Super fast dev server and modern tooling
- **Axios**: Simplified request handling

## Future Improvements

- Add user authentication (JWT)
- Connect to MongoDB Atlas
- Add user-specific dashboards
- Dark mode toggle
- Notifications/reminders for application deadlines
- Advanced filtering and sorting

## Live Demo

[Insert your live app URL here]

## Features

- **Home Page:** Welcome screen with navigation to key sections.
- **Jobs Page:** Search and browse available job listings.
- **Saved Jobs:** View and manage jobs saved for later (enabled only on Jobs page).
- **Profile:** View and edit personal details, including email preferences toggle.
- **Preloader:** Loading animation on app start.
- **Responsive Navigation:** Dynamic nav links with conditional enable/disable states.
- **API Integration Ready:** Profile edits designed to connect with backend API for saving user data.

## Getting Started

### Installation

```bash
git clone https://github.com/yourusername/career-snap.git
cd career-snap
npm install
```
