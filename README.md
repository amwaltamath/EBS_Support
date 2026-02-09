# EBS Support

A modern documentation and vendor management system built with React + Vite frontend and Node.js + SQLite backend.

## Features

- 🔐 **Secure Login** - Email/password authentication with JWT tokens
- 📋 **Vendor Management** - Track vendors, account reps, and support contacts
- 👥 **Team Members** - Manage team roster with roles and contact info
- 📄 **Document Upload** - Store and organize vendor documentation
- 👤 **Support Contact Assignment** - Assign primary and secondary support contacts per vendor

## Quick Start

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Start Both Servers

Open two terminals:

**Terminal 1 - Backend (SQLite + Express)**
```bash
cd backend
npm run dev
```
The API will start at `http://localhost:3001`

**Terminal 2 - Frontend (React + Vite)**
```bash
npm run dev
```
The UI will start at `http://localhost:5173`

### 3. Login

Default credentials:
- **Email:** `admin@ebs-support.local`
- **Password:** `admin123`

## Project Structure

```
EBS_Support/
├── src/                      # React frontend
│   ├── pages/               # Login, Vendors, Team, Upload pages
│   ├── components/          # AppLayout, shared components
│   ├── lib/                 # API client, auth context
│   └── styles.css           # Global styles
├── backend/                 # Node.js + Express API
│   ├── db/                  # SQLite schema & initialization
│   ├── routes/              # Auth, vendors, team, documents endpoints
│   ├── middleware/          # JWT authentication
│   ├── uploads/             # Uploaded documents (local storage)
│   └── server.js            # Express entry point
├── package.json             # Frontend dependencies
└── backend/package.json     # Backend dependencies
```

## Database

SQLite database is created automatically at `backend/db/ebs-support.db` on first run.

Schema includes:
- **users** - Team members with roles (admin, editor, viewer)
- **team_members** - Extended user profiles (title, department, phone)
- **vendors** - Vendor records with account rep info and support contact assignments
- **documents** - Uploaded files linked to vendors

## API Endpoints

### Auth
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user (protected)

### Vendors
- `GET /api/vendors` - List all vendors (protected)
- `GET /api/vendors/:id` - Get vendor with documents (protected)
- `POST /api/vendors` - Create vendor (protected)
- `PUT /api/vendors/:id` - Update vendor (protected)
- `DELETE /api/vendors/:id` - Delete vendor (protected)

### Team
- `GET /api/team` - List all team members (protected)
- `GET /api/team/:id` - Get team member (protected)
- `PUT /api/team/:id` - Update team member (protected)

### Documents
- `GET /api/documents/vendor/:vendorId` - Get docs for vendor (protected)
- `POST /api/documents/upload` - Upload document (protected)
- `GET /api/documents/:id/download` - Download document (protected)
- `DELETE /api/documents/:id` - Delete document (protected)

## Next Steps

- Add role-based access control (RBAC)
- Implement add/edit/delete modals for vendors and team members
- Add document preview
- Create vendor detail page with full history
- Add search and filters
