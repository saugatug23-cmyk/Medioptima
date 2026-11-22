# MediOptima

MediOptima is a smart healthcare medicine procurement platform. It helps patients find required medicines across nearby pharmacies and creates an efficient procurement plan using optimization and machine learning.

## Architecture

The project is structured as a full-stack web application with the following components:

- **Frontend (`/client`)**: React + Vite + Tailwind CSS
- **Backend (`/server`)**: Node.js + Express + MongoDB
- **Machine Learning (`/ml`)**: Python + scikit-learn (To be implemented)
- **Optimization (`/optimization`)**: C++ (To be implemented)

## Technology Stack

- **Frontend**: React, Vite, React Router, Tailwind CSS, Lucide React, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Folder Structure

```
MediOptima/
├── client/           # React frontend
├── server/           # Express backend API
├── ml/               # Python ML models and data
├── optimization/     # C++ optimization engine
├── docs/             # Project documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or remote)

### Installation

1. Clone the repository.
2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

### Running the Application

**Frontend:**
```bash
cd client
npm run dev
```
The frontend will be available at `http://localhost:5173`

**Backend:**
```bash
cd server
npm start
```
The backend will be available at `http://localhost:5000`

Ensure you have a `.env` file in the `server` directory (based on `.env.example`).

## Future Implementations

- **ML Layer**: Python-based prediction engines for pricing and availability.
- **Optimization**: C++ engine for advanced routing and pharmacy selection.
- **Authentication**: JWT-based user and admin auth.
- **Routing**: Leaflet maps integration for turn-by-turn navigation.

## Authentication

Authentication is implemented using JWT tokens and bcrypt. 
- PATIENT role is assigned by default to public registrations.
- ADMIN role is restricted. Development admin can be seeded using the seed script by setting ADMIN_EMAIL and ADMIN_PASSWORD in the .env file.
- Protected routes redirect unauthenticated users to /login and prevent unauthorized access.
- Passwords and JWT secrets are handled securely.
