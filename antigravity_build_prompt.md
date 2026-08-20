# Build Prompt for Antigravity — Smart Gram Panchayat Portal, Londhave

Copy everything below into Antigravity as the project brief.

---

## Project

Build a **Smart Gram Panchayat digital citizen services portal** for **Londhave village, Amalner taluka, Jalgaon district, Maharashtra, India**.

This is a full-stack web application: a citizen-facing site (mobile-first, installable as a PWA) plus an **Admin Dashboard** for Gram Panchayat staff, sharing one backend API and one database. Build it as a real, working application with sample/seed data — not a static mockup.

Full functional and technical detail is in the attached reference document **`Londhave_Portal_Design.docx`** (design blueprint, 19 sections). Treat it as the source of truth for scope; this prompt summarizes the build order and constraints.

## Build order — start with the Admin Dashboard

Build in this sequence, and stop to show working output after each phase before continuing:

1. **Phase 0 — Foundations**: project scaffold, database schema, authentication (OTP-based citizen login + role-based staff/admin login), trilingual framework (see below), base layout/design system.
2. **Phase 1 — Admin Dashboard + Core Content (priority)**: full Admin Dashboard (metrics, content management, user management) plus the citizen-facing modules it manages — Home, Gram Panchayat Info, Village Info, Notice Board, Important Contacts, Gallery, Weather, News.
3. **Phase 2 — Citizen Services**: Complaint Management, Tax Payment (use a mock/sandbox payment flow), Certificates, Citizen Profile.
4. **Phase 3 — Engagement & Info**: Government Schemes, Events, Surveys/Polls, Water Supply/Garbage/Electricity schedules, Public Announcements, Document Download, Village Development Dashboard.
5. **Phase 4 — Polish**: notifications (push/SMS stub), reports export (PDF/Excel), accessibility pass, responsive/mobile QA.

## Trilingual requirement (non-negotiable, applies from Phase 0)

Every screen — citizen and admin — must have a **language switcher** offering **English, Marathi (मराठी), and Hindi (हिंदी)**, visible on every page.

- Default language: English. Selection persists (localStorage for guests, user profile for logged-in users) and applies instantly with no reload.
- **Static UI text** (labels, buttons, menus, form fields, errors) → use an i18n library (e.g. `react-i18next` or `next-intl`) with one resource file per language (`en.json`, `mr.json`, `hi.json`).
- **Dynamic content** (news, notices, scheme descriptions, events) → store per-language fields in the database (a `translations` table keyed by content ID + language code), with an admin editor that has three tabs — English / मराठी / हिंदी — for every content type.
- If a translation is missing for the selected language, fall back to English and flag it in the admin UI.
- Use a Devanagari-capable font (e.g. Noto Sans Devanagari) for Marathi and Hindi so both render correctly.
- No screen should ever mix languages.

## Tech stack

Use this stack unless you have a strong reason to deviate (explain if you do):

- **Frontend (citizen site)**: React or Next.js, mobile-first, installable PWA, Tailwind CSS.
- **Admin Dashboard**: same framework, separate route/app section with role-gated access, data tables + charts (e.g. Recharts).
- **Backend**: Node.js with Express or NestJS, REST/JSON API.
- **Database**: PostgreSQL. Use the translation-pattern schema (content items + linked per-language translation rows) described in the reference doc, Section 9.
- **Auth**: OTP-based login for citizens (mock/stub the SMS OTP send in dev — log the OTP to console); email/password + role-based access control for staff/admin.
- **File storage**: local/dev object storage for photos, videos, PDFs (complaint photos, gallery, certificates, notices).
- **Payments**: implement Tax Payment with a mocked payment gateway flow (UPI/Card/Net Banking UI, fake success/failure, generates a downloadable receipt) — do not integrate real payment credentials.

## User roles

| Role | Access |
|---|---|
| Guest | Public browsing, no login |
| Citizen (नागरिक) | Mobile OTP login; complaints, tax payment, certificates, profile |
| Employee/Staff | Role-based login; handle assigned complaints, limited content edits |
| Gram Panchayat Admin | Full dashboard: content, complaints, users, schemes, reports, notifications |
| Super Admin | Roles, departments, system settings, audit log |

## Admin Dashboard — build this first, in full

- **Dashboard home**: metric cards — Total Citizens, Total Complaints, Resolved Complaints, Pending Complaints, Tax Collection, Scheme Beneficiaries, Active Users — plus trend charts (complaints over time, tax collection).
- **Content Management**: create/edit/publish/archive News, Notices, Gallery, Events, Schemes, Documents — each with the EN/मराठी/हिंदी tabbed editor, scheduling, and pinning.
- **Complaint Management**: queue with filters (category, priority, status, date), assign to staff, status changes (Pending → In Progress → Completed), remarks, resolution photos.
- **User Management**: manage citizens, employees, departments; role-based permissions.
- **Reports**: Complaint, Tax, Scheme, Citizen, Event, User Activity reports, exportable to PDF/Excel.
- **Notifications**: composer for push/SMS/WhatsApp-style broadcasts (stub the actual send).
- **Global search** across schemes, notices, employees, services.
- **Audit log** of admin actions.

## All citizen modules (build after Admin Dashboard, per phase order above)

1. Gram Panchayat Info — Sarpanch, Up-Sarpanch, members, Gramsevak, staff directory, office hours, contact
2. Village Info — history, population, map, schools, temples, health centre, Anganwadi, bank, post office, tourist spots
3. Government Schemes — category-wise (Agriculture, Women, Students, Elderly, Divyang, Employment, Jal Jeevan, PMAY, PM-Kisan, Pension), eligibility, documents
4. Complaint Management — submit with category/priority/photo/location, status tracking, history
5. Tax Payment — House/Water/Light/Other tax, mock payment gateway, receipt download, history
6. Certificates — Birth, Death, Residence, No-Dues, Income (reference) — apply, track, download
7. Notice Board — Notices, Circulars, Tenders, Meetings, PDF download
8. Events — Gram Sabha, Health Camp, Plantation, Sports, Cultural Program
9. Gallery — photo/video albums
10. Weather — current + rain forecast (use a free weather API or mock data)
11. News — Village/District/Government news
12. Water Supply Schedule — area-wise timing/status
13. Garbage Collection — route/date/timing
14. Electricity Outage — scheduled/emergency
15. Public Announcements — push/SMS style broadcast display
16. Survey/Poll — citizen feedback, voting, suggestions
17. Important Contacts — Police, Ambulance, Hospital, Fire, Talathi, BDO, CEO Office (click-to-call)
18. Village Development Dashboard — public charts: population, roads, water supply, schools, health centres, street lights, trees, scheme beneficiaries
19. Document Download — Forms, GR, Circulars, Certificate formats
20. Citizen Profile — My Applications, My Complaints, My Payments, My Certificates, language/notification preferences

## Design & UX

- Mobile-first, large tap targets, icon + text labels for low-literacy users.
- High-contrast, accessible color palette; WCAG 2.1 AA target.
- Home screen: logo + village name, language switcher, notice banner, emergency contact, photo slider, quick-action tiles (Pay Tax, File Complaint, Certificate, Notices, Schemes, Contacts), news/events strips, weather widget, bottom nav (Home/Services/Notices/Profile).
- Admin: left sidebar nav (Dashboard, Content, Complaints, Users, Reports, Notifications, Settings), top bar with search + language switcher + profile.

## Data

Seed the database with realistic sample data for Londhave village so the app is demoable end-to-end: a sample Sarpanch/members list, a handful of notices/news/events in all 3 languages, a few sample complaints in different statuses, sample tax bills, and sample scheme entries across categories.

## Deliverable expectations

- A working, runnable full-stack app (clear `README.md` with setup/run instructions).
- Clean project structure separating frontend, backend, and shared types.
- Environment variables documented (`.env.example`) for anything needing real credentials (payment, SMS, weather API) — app should run in a fully mocked/dev mode without them.
- Responsive on mobile and desktop; test the language switcher on every major screen before moving to the next phase.

---

*Reference: `Londhave_Portal_Design.docx` — full blueprint with module details, database schema, security/compliance notes (GIGW 3.0, WCAG 2.1 AA), and rationale. Attach it in Antigravity alongside this prompt if it supports file context.*
