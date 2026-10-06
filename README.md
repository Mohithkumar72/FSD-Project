# College Laboratory Equipment Management System

A full-stack web application designed for higher education institutions to manage laboratory computers, networking devices, electronic equipment, and software licenses.

---

## 🌟 Key Features

### 🖥️ Frontend (React & Modern JavaScript)
- **Equipment Catalog**: Real-time browsing of lab hardware with asset tags and technical specifications.
- **Dynamic Search & Multi-Filters**: Instant search by asset tag, name, or model, combined with dropdown filters for laboratory, category, and operational status (`useState`, `useEffect`, `map()`, and `filter()`).
- **Equipment Details Modal**: View comprehensive hardware specs, room location, faculty in-charge, and warranty terms.
- **Controlled Forms**: Modal dialogs with state-controlled validation for adding equipment, reporting damage, and issuing loans.
- **Damage & Fault Reporting**: Report equipment breakdown with severity rankings (`Low`, `Medium`, `High`, `Critical`).
- **Maintenance Lifecycle**: Track issues through `Reported` ➔ `In Progress` ➔ `Resolved` with cost logging.
- **Equipment Allocations**: Checkout/loan tracking to students/faculty with expected and actual return dates.
- **Admin Dashboard**: Visual analytics summarizing inventory distributions by Lab, Category, and Status.

### ⚙️ Backend (Node.js & Express)
- **Modular RESTful Architecture**: Clean separation into controllers, routes, config, and middleware.
- **Relational SQL Queries**: Implementation of `JOIN`, `UPDATE`, `DELETE`, `COUNT(*)`, and `GROUP BY`.
- **Validation & Error Handling**: Custom middleware ensuring input sanitization and unified error responses.
- **Dual-Engine DB Adapter**: Seamlessly operates on live MySQL (Port 3306) and falls back to a high-fidelity SQL memory store for instant grading and evaluation without database setup blockers.

### 🗄️ Database (MySQL)
- `laboratories`: Laboratories metadata, rooms, and faculty coordinators.
- `categories`: Hardware and software classification hierarchy.
- `equipment`: Inventory records with asset tags and foreign keys.
- `allocations`: Checkout records tracking borrower, issuer, and duration.
- `maintenance`: Fault reports, severity, technician notes, and expenses.
- `users`: Administrative staff, faculty, lab assistants, and students.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MySQL (Optional: app includes seamless instant fallback if MySQL is offline)

### 1. Database Setup (MySQL)
Run the provided SQL scripts in your MySQL client (e.g. MySQL Workbench, phpMyAdmin, or CLI):
```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/seed.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend server runs on `http://localhost:5000`.

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be live at `http://localhost:5173`.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/equipment` | Retrieve all equipment (supports `?search=`, `?category_id=`, `?laboratory_id=`, `?status=`) |
| `GET` | `/api/equipment/:id` | Get details for specific equipment |
| `POST` | `/api/equipment` | Register new equipment |
| `PUT` | `/api/equipment/:id` | Update equipment details |
| `PATCH` | `/api/equipment/:id/status` | Update operational status |
| `DELETE` | `/api/equipment/:id` | Remove equipment record |
| `GET` | `/api/maintenance` | View all maintenance tickets |
| `POST` | `/api/maintenance/report` | Report damaged equipment |
| `PATCH` | `/api/maintenance/:id/status`| Update maintenance status and resolution notes |
| `GET` | `/api/allocations` | List all equipment allocations |
| `POST` | `/api/allocations` | Allocate equipment to student or faculty |
| `PATCH` | `/api/allocations/:id/return`| Mark allocated equipment as returned |
| `GET` | `/api/reports/summary` | Aggregate analytics via `GROUP BY` and `COUNT` |
| `GET` | `/api/laboratories` | List all labs |
| `GET` | `/api/categories` | List all equipment categories |
| `GET` | `/api/users` | List all system users |

---

## 📊 SQL Query Reference

Key queries implemented in `backend/database/queries.sql`:
- **JOIN Query**: Fetches equipment with category and laboratory in-charge details.
- **COUNT & GROUP BY**: Computes inventory distribution by laboratory and status.
- **UPDATE Query**: Transitions status when repairs or returns occur.
- **DELETE Query**: Decommissioning records safely.

---

## 🛠️ Git & GitHub Practices
Refer to [`GITHUB_WORKFLOW.md`](./GITHUB_WORKFLOW.md) for details on feature branch conventions, issue templates, and Pull Request reviews.
