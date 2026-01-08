# Service Management System – Frontend

A **modern Angular-based frontend application** for the **Service Management System**, providing role-based dashboards and workflows for **Customers, Technicians, Service Managers, and Admins**.

This frontend communicates **only via the API Gateway** and supports secure JWT authentication, role guards, interceptors, and modular lazy-loaded routes.

---

## Tech Stack

* **Framework:** Angular (Standalone Components)
* **Language:** TypeScript
* **Styling:** CSS 
* **Routing:** Angular Router (Lazy Loaded)
* **State Handling:** RxJS (BehaviorSubject)
* **Security:** JWT (via HTTP Interceptor)
* **Build Tool:** Angular CLI
* **Backend Integration:** Spring Boot Microservices (via API Gateway)

---

## Application Architecture

```text
src/
├── app/
│   ├── core/           # Guards, interceptors, models, services
│   ├── modules/        # Feature modules (Admin, Customer, Technician, etc.)
│   ├── shared/         # Reusable UI components
│   ├── app.routes.ts   # Central routing
│   └── app.ts          # Root standalone component
├── environments/       # Environment configs
└── main.ts             # Application bootstrap
```

Fully **modular, role-based, and scalable architecture** 

---

## 👥 Supported User Roles

| Role            | Capabilities                                       |
| --------------- | -------------------------------------------------- |
| Customer        | Browse services, create bookings, view invoices    |
| Technician      | Manage assigned jobs, update status, complete work |
| Service Manager | Approve technicians, assign bookings, dashboards   |
| Admin           | User management, audit logs, system reports        |

---

## Authentication & Security

### Implemented Security Features

* JWT-based authentication
* Role-based route protection
* Email verification guard
* Token auto-refresh
* Global error handling

### Route Guards

* `auth.guard` → Authenticated users only
* `role.guard` → Role-based access
* `email-verified.guard` → Verified users only

---

## HTTP Interceptors

| Interceptor         | Purpose                        |
| ------------------- | ------------------------------ |
| Auth Interceptor    | Attaches JWT, refreshes token  |
| Error Interceptor   | Centralized API error handling |
| Loading Interceptor | Global loading indicator       |

---

## Routing Strategy

* **Lazy-loaded modules** for performance
* **Standalone components**
* Centralized role-based routing

Example:

```ts
/admin → Admin Module
/customer → Customer Module
/technician → Technician Module
/manager → Service Manager Module
```

---

##  Backend Integration

All API calls are routed through:

```
API Gateway → http://localhost:8080
```

Configured in:

```ts
environment.ts
```

```ts
apiUrl: 'http://localhost:8080'
```

---

## 🧪 Development Setup

### 1️ Prerequisites

* Node.js (LTS)
* Angular CLI
* Backend services running (Docker recommended)

---

### 2️ Install Dependencies

```bash
npm install
```

---

### 3️ Start Development Server

```bash
ng serve
```

Access at:

```
http://localhost:4200
```

---

## Build for Production

```bash
ng build --configuration=production
```

Output:

```text
dist/
```

---

## UI & UX Highlights

* Urban Company–style clean UI
* Responsive layouts
* Role-specific dashboards
* Central notification system
* Global loader for API calls

---

## Key Features

* Secure JWT authentication
* Role-based dashboards
* Booking lifecycle management
* Invoice & payment handling
* Technician approval workflow
* Admin audit logs & reports
* API Gateway–only communication

---

## Important Notes

* Frontend **does not communicate directly with microservices**
* All requests go through **API Gateway**
* Requires backend services running for full functionality

---


