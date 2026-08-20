# Smart Gram Panchayat Londhave Digital Citizen Services Portal
**Londhave Village • Taluka Amalner • District Jalgaon • Maharashtra, India**

A full-stack, production-ready, mobile-first PWA citizen portal and Admin Dashboard for Gram Panchayat Londhave.

---

## Key Features & Highlights

- **Trilingual Core (Non-negotiable)**: Every screen carries an instant language switcher offering **English**, **Marathi (मराठी)**, and **Hindi (हिंदी)**. Static UI uses `react-i18next` resources while dynamic DB content (notices, news, schemes, events) uses a linked translation-pattern table with a **3-tab Admin Editor**.
- **Admin Dashboard (Priority)**: Live metrics (Citizens, Complaints, Resolution Rate, Tax Collections, Beneficiaries), Recharts graphs, grievance processing queue, citizen/staff user management, PDF & Excel reports generator, broadcast alerts, and CERT-In aligned audit logs.
- **Citizen Portal (Mobile-First PWA)**: Mobile bottom navigation, emergency hotline bar, local weather forecast widget, quick-action tiles, village facility directory, and citizen profile.
- **Citizen Services**:
  - **Complaint Redressal**: Ticket generation, photo attachment, status tracking, staff assignment & resolution remarks.
  - **Tax Payment System**: House Property & Water Tax, mock gateway (UPI QR / Card / Net Banking) & downloadable official tax receipt.
  - **Certificates Portal**: Online application for Residence, Birth, Death, No-Dues, Income certificates & issued certificate PDF download.
  - **Schemes Hub**: Category-wise government welfare schemes with eligibility & document lists.
  - **Utility Schedules**: Water supply timings, door-to-door garbage routes, electricity maintenance alerts.
  - **Public Polling & Feedback**: Interactive village voting on development priorities.

---

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, `react-i18next`, Recharts, XLSX.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, JWT Auth, bcryptjs.
- **Database**: PostgreSQL (`grampanchayat_londhave` DB).

---

## Credentials & Test Accounts

### 1. Citizen Mobile Login (Mock OTP)
- **Mobile Number**: Any 10-digit number (e.g., `9876543210`, `9876543211`, `9876543212`)
- **Development OTP Code**: `123456`

### 2. Admin & Staff Logins
- **GP Admin / Sarpanch**: `sarpanch@londhavegp.in` / Password: `admin123`
- **Gramsevak / VDO**: `gramsevak@londhavegp.in` / Password: `admin123`
- **Super Admin**: `superadmin@londhavegp.in` / Password: `admin123`
- **Water Dept Staff**: `waterstaff@londhavegp.in` / Password: `staff123`
- **Sanitation Staff**: `sanitationstaff@londhavegp.in` / Password: `staff123`

---

## Local Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- PostgreSQL service running on `localhost:5432`

### 1. Backend Setup & Run
```bash
cd backend
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
Backend API will start on: `http://localhost:5001`

### 2. Frontend Setup & Run
```bash
cd frontend
npm install
npm run dev
```
Frontend Citizen & Admin Portal will start on: `http://localhost:3000`

---

## System Architecture

```
                                 +-------------------------------------+
                                 |         React Frontend (Vite)       |
                                 |   EN | मराठी | हिंदी i18n Switcher  |
                                 +------------------+------------------+
                                                    |
                                                    v
                                 +-------------------------------------+
                                 |        Express REST API Server      |
                                 |        JWT Auth + Multer + CORS     |
                                 +------------------+------------------+
                                                    |
                                                    v
                                 +-------------------------------------+
                                 |        PostgreSQL Database          |
                                 |     Prisma ORM Translation Schema   |
                                 +-------------------------------------+
```
