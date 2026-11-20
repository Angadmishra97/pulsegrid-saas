# PulseGrid — Multi-Tenant SaaS Project & Task Management Platform

PulseGrid is a full-stack multi-tenant project management and visual workflow board web application built with the MERN stack. It enables organizations to onboard workspaces, manage projects, track task lifecycles (`Backlog`, `InProgress`, `Done`), and maintain isolated data boundaries across tenants.

**Live Demo:** [https://pulsegrid-saas.vercel.app](https://pulsegrid-saas.vercel.app)

---

## Key Features

- **Multi-Tenant Organization Isolation:** Tenant-scoped data access so organizations and users only read and mutate records belonging to their workspace.
- **JWT Authentication & Session Handling:** Protected registration, sign-in, and authenticated API requests with token verification middleware.
- **Project Management:** Create and switch across organization projects with structured metadata and status tracking.
- **Visual Workflow Board:** Manage tasks across `Backlog`, `InProgress`, and `Done` states with persistent database updates.
- **RESTful API & Auditability:** Express REST endpoints backed by MongoDB and Mongoose, plus activity/audit trail support.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT (JSON Web Tokens), CORS |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Deployment** | Vercel (Frontend), Render (Backend API) |

---

## Architecture Overview

```text
[React + Vite Client @ Vercel]
          |
          |  HTTPS / JSON (Axios + Bearer JWT)
          v
[Node.js + Express API @ Render]
          |
          |  Mongoose ODM
          v
[MongoDB Atlas Cluster]
