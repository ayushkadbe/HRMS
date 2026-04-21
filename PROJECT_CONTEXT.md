# PROJECT_CONTEXT

## 1. Project Identity

- Project name: `MERN Employee Salary Management`
- Product name in UI/docs: `SiPeKa` (`Sistem Penggajian Karyawan`)
- Domain: employee payroll and attendance management
- Architecture style: split frontend/backend monorepo-style repository
- Runtime style:
  - Frontend: React single-page application served by Vite
  - Backend: Express API server with session-based authentication
  - Database: MySQL/MariaDB via Sequelize ORM

This document is derived from the repository contents, especially:

- root `README.md`
- `Backend/` source files
- `Frontend/` source files
- `Backend/db/db_penggajian3.sql`
- `Backend/request_test/*.rest`

Important note:

- There is **no standalone BRD, FRD, or formal SRS document** in the repo.
- The business requirements, functional requirements, software requirements, use cases, and system behavior below are **inferred from the implementation and README**.

---

## 2. High-Level Product Summary

SiPeKa is a payroll system for a company. It centralizes:

- employee master data
- job/position master data
- attendance transaction data
- deduction rules
- payroll calculation
- payroll reporting
- payslip generation
- password management for admin and employees

There are 2 main user roles:

- `admin`
  - manages employee records
  - manages job definitions and salary components
  - records attendance
  - configures salary deductions
  - views payroll results
  - prints salary reports, attendance reports, and payslips
- `pegawai` (employee/staff)
  - logs in
  - views own profile/dashboard
  - views own salary data
  - prints own salary data
  - changes own password

---

## 3. Inferred Business Requirement Document

## 3.1 Business Problem

The company needs a centralized payroll system because salary administration involves multiple connected datasets:

- employee identity and role
- position and pay components
- monthly attendance
- deduction policies
- monthly salary computation

Without such a system, payroll becomes manual, repetitive, error-prone, and difficult to audit.

## 3.2 Business Goals

- reduce manual payroll processing
- ensure salary calculations are consistent
- centralize employee and salary-related data
- allow role-based access for admin and employees
- support operational reporting and printable salary documents

## 3.3 Business Scope

In scope:

- login/logout
- employee data management
- position data management
- attendance data management
- salary deduction management
- payroll calculation
- payroll reports
- attendance reports
- payslip output
- employee self-service salary viewing
- password updates

Out of scope based on current code:

- tax computation
- overtime logic
- leave balance management
- approval workflows
- bank transfer integration
- audit trail/history logs
- multi-company or multi-tenant support
- environment-based deployment configuration

---

## 4. Inferred Functional Requirement Document

## 4.1 Authentication

- Users can log in using `username` and `password`.
- Sessions are stored server-side using `express-session` + Sequelize session store.
- Users can fetch current session identity using `/me`.
- Users can log out.
- Auth is role-aware through `hak_akses`.

## 4.2 Employee Master Data

- Admin can:
  - view all employees
  - view employee by ID
  - view employee by NIK
  - view employee by name
  - create employee
  - update employee
  - delete employee
  - change employee password
- Employee creation includes photo upload.

## 4.3 Position / Job Data

- Admin can:
  - view all job/position records
  - view one position by ID
  - create position
  - update position
  - delete position

Each position defines:

- `nama_jabatan`
- `gaji_pokok`
- `tj_transport`
- `uang_makan`

## 4.4 Attendance Data

- Admin can:
  - view attendance records
  - view attendance by ID
  - create attendance
  - update attendance
  - delete attendance

Attendance is stored monthly and includes:

- month
- employee identity
- position
- counts of `hadir`, `sakit`, `alpha`

## 4.5 Deduction Data

- Admin can:
  - view salary deduction rules
  - view deduction by ID
  - create deduction rule
  - update deduction rule
  - delete deduction rule

Current deduction logic uses deduction names like:

- `alpha`
- `sakit`

## 4.6 Salary Calculation

System derives payroll data from:

- employee master data
- position salary data
- attendance data
- deduction rules

Computed salary includes:

- base salary
- transport allowance
- meal allowance
- total deductions
- net total salary

## 4.7 Reporting

Admin can retrieve:

- salary reports by all/month/year/name
- attendance reports by month/year
- payslips by month/year/name

## 4.8 Employee Self-Service

Employees can:

- see their profile/dashboard data
- view salary data by month/year
- print their own salary output
- change own password

---

## 5. Inferred Software Requirement Specification

## 5.1 Functional Modules

- public landing pages
- authentication
- admin dashboard
- employee dashboard
- master data
- transactions
- reports
- print views
- settings/password update

## 5.2 Non-Functional Characteristics Seen in Code

- simple SPA UX with protected navigation through frontend redirects
- session + cookie based auth
- local-development-oriented URLs (`http://localhost:5000`, `http://localhost:5173`)
- responsive UI with Tailwind
- print-friendly report pages using `react-to-print`
- animation and dark mode support

## 5.3 Constraints

- database connection is hardcoded in backend config
- frontend API base URLs are mostly hardcoded
- no test suite
- no typed API contracts
- no server-side validation framework
- no centralized error handling middleware

---

## 6. Technology Stack

## 6.1 Frontend

- React 18
- React Router DOM 6
- Redux Toolkit and classic Redux-style action/reducer files
- Axios
- Tailwind CSS
- Vite
- Framer Motion
- SweetAlert2
- React Icons
- React to Print
- ApexCharts / React ApexCharts
- EmailJS
- react-modern-drawer
- jsvectormap

## 6.2 Backend

The Foundation

* **Node.js** **: The runtime environment that lets you run JavaScript on a server instead of just in a browser.**
* **Express** **: The web framework for Node.js. It simplifies handling routes (like** `GET /users`), middleware, and HTTP requests.

Database & ORM

* **Sequelize** **: An ORM (Object-Relational Mapper). It lets you interact with your database using JavaScript objects (e.g.,** `User.create()`) instead of writing raw SQL queries.
* **MySQL2** **: The underlying driver that Sequelize uses to actually talk to your** **MariaDB** **(or MySQL) database.**

Authentication & Sessions

* **express-session** **: Middleware that creates a "session" for a user. It gives them a unique ID so the server can remember who they are as they move from page to page.**
* **connect-session-sequelize** **: A bridge that tells** `express-session` **to store those session IDs in your** **MariaDB** **database (via Sequelize) rather than in the server's temporary memory.**
* **argon2** **: A highly secure library for**  **hashing passwords** **. You use this to scramble passwords before saving them to the database so they can't be read if the data is stolen.**

Utilities & Helpers

* **cors** **: Cross-Origin Resource Sharing. This security middleware allows your API to accept requests from a different domain (like your frontend running on a different port).**
* **dotenv** **: Loads environment variables from a** `.env` **file. It keeps sensitive info (like database passwords and API keys) out of your main code.**
* **express-fileupload** **: Simple middleware that allows your API to handle** **file uploads** **(like profile pictures) sent from the frontend.**
* **moment** **: A library for**  **parsing and formatting dates** **. (Note: While popular, many developers are now switching to lighter alternatives like** `dayjs` **or native** `Intl` **features).**

## 6.3 Database

- MySQL / MariaDB
- dump file included: `Backend/db/db_penggajian3.sql`

---

## 7. Repository Structure

Top level:

```text
.
├── Backend/
├── Frontend/
├── README.md
├── SECURITY.md
└── LICENSE
```

Backend high-level:

```text
Backend/
├── config/
│   └── Database.js
├── controllers/
│   ├── Auth.js
│   ├── DataJabatan.js
│   ├── DataPegawai.js
│   ├── LaporanController.js
│   ├── Pegawai.js
│   └── TransaksiController.js
├── db/
│   └── db_penggajian3.sql
├── middleware/
│   └── AuthUser.js
├── models/
│   ├── DataJabatanModel.js
│   ├── DataKehadiranModel.js
│   ├── DataPegawaiModel.js
│   ├── PotonganGajiModel.js
│   └── Transaksi.js
├── request_test/
│   ├── *.rest sample API requests
├── routes/
│   ├── AuthRoute.js
│   └── UserRoute.js
├── index.js
├── package.json
├── README.md
└── Note.txt
```

Frontend high-level:

```text
Frontend/
├── public/
├── src/
│   ├── Assets/
│   ├── components/
│   │   ├── atoms/
│   │   └── molecules/
│   ├── config/
│   │   ├── Routes/
│   │   └── redux/
│   ├── hooks/
│   ├── layout/
│   ├── pages/
│   │   ├── Admin/
│   │   ├── Pegawai/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── About/
│   │   ├── Contact/
│   │   └── Dashboard/
│   ├── shared/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── satoshi.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.cjs
└── postcss.config.cjs
```

Approximate file counts in repo source areas:

- `Backend`: 29 files
- `Frontend`: 175 files

---

## 8. Architecture Overview

## 8.1 System Architecture

```text
Browser
  -> React SPA (Frontend on Vite, localhost:5173)
    -> Axios HTTP requests with cookies
      -> Express API (Backend, localhost:5000)
        -> Middleware: session, CORS, JSON, file upload, auth guards
          -> Controllers
            -> Sequelize models
              -> MySQL database
```

## 8.2 Runtime Request Flow

Typical flow:

1. User logs in from React login page.
2. Frontend POSTs to `/login`.
3. Backend verifies password with Argon2.
4. Backend writes `req.session.userId`.
5. Browser keeps session cookie.
6. Later API calls use the same cookie because `axios.defaults.withCredentials = true`.
7. Backend middleware validates session and role.
8. Controller returns JSON.
9. Frontend stores/uses data via Redux or local component state.

---

## 9. Backend Architecture

## 9.1 Entry Point

File: `Backend/index.js`

Purpose:

- bootstraps the Express application
- connects session storage to Sequelize
- loads middleware
- mounts routes
- starts server on `process.env.APP_PORT`

What it contains:

- `express()`
- `express-session`
- `connect-session-sequelize`
- `cors`
- `express.json()`
- `express-fileupload`
- static serving from `public`
- route registration for `UserRoute` and `AuthRoute`

Important behavior:

- CORS origin is fixed to `http://localhost:5173`
- session cookie uses `secure: 'auto'`
- static files are expected under `Backend/public`

## 9.2 Database Configuration

File: `Backend/config/Database.js`

Purpose:

- creates Sequelize connection instance

What it contains:

- DB name: `db_penggajian3`
- username: `root`
- password: empty string
- host: `localhost`
- dialect: `mysql`

Important note:

- connection values are hardcoded, not environment-driven

## 9.3 Middleware

File: `Backend/middleware/AuthUser.js`

Purpose:

- gate access to authenticated users
- gate access to admin-only routes

Exports:

- `verifyUser`
- `adminOnly`

How it works:

- reads `req.session.userId`
- looks up matching employee by `id_pegawai`
- attaches:
  - `req.userId`
  - `req.hak_akses`
- `adminOnly` ensures `hak_akses === "admin"`

## 9.4 Routing Layer

### `Backend/routes/AuthRoute.js`

Purpose:

- dedicated auth routes

Routes:

- `GET /me`
- `POST /login`
- `DELETE /logout`

### `Backend/routes/UserRoute.js`

Purpose:

- main business API surface

Contains routes for:

- employee master data
- position master data
- attendance
- deductions
- computed salary data
- reports
- employee dashboard
- password changes

Important design note:

- This single router combines admin and employee endpoints.

---

## 10. Backend Controllers

## 10.1 `Auth.js`

Purpose:

- login/logout/session identity/password update

Main functions:

- `Login`
  - finds employee by username
  - verifies password with Argon2
  - stores `req.session.userId = pegawai.id_pegawai`
  - returns role-aware user payload
- `Me`
  - returns current logged-in user from session
- `LogOut`
  - destroys session
- `changePassword`
  - lets authenticated user change own password

## 10.2 `DataPegawai.js`

Purpose:

- CRUD for employee records

Main functions:

- `getDataPegawai`
- `getDataPegawaiByID`
- `getDataPegawaiByNik`
- `getDataPegawaiByName`
- `createDataPegawai`
- `updateDataPegawai`
- `deleteDataPegawai`
- `changePasswordAdmin`

Special logic:

- handles uploaded photo files
- limits image extension to `.png`, `.jpg`, `.jpeg`
- limits image size to 2 MB
- stores photo under `./public/images/`
- hashes password before insert

## 10.3 `DataJabatan.js`

Purpose:

- CRUD for position/job definitions

Fields managed:

- position name
- base salary
- transport allowance
- meal allowance

Association usage:

- includes related `DataPegawai` creator/user for admin fetches

## 10.4 `TransaksiController.js`

Purpose:

- attendance transaction CRUD
- deduction rule CRUD
- payroll computation logic

Main sections:

- attendance APIs
- deduction APIs
- helper getters for employee/position/attendance/deduction datasets
- payroll calculation merger logic
- payroll query endpoints by name/month/year

Core business logic:

- joins employee data with position salary values
- joins attendance with deduction rules
- computes:
  - `potonganSakit`
  - `potonganAlpha`
  - `total_potongan`
  - final salary total

Formula used in code:

```text
total salary =
  gaji_pokok
  + tj_transport
  + uang_makan
  - total_potongan
```

Source of month/year:

- month comes from attendance record `bulan`
- year is derived from attendance `createdAt`

## 10.5 `LaporanController.js`

Purpose:

- reporting endpoints built on top of salary/attendance data

Main capabilities:

- salary reports by all/month/year/name
- attendance reports by month/year
- payslip data by month/year/name

Implementation pattern:

- mostly filters/transforms data produced by `TransaksiController`

## 10.6 `Pegawai.js`

Purpose:

- employee-specific dashboard and self-service salary views

Main functions:

- `dashboardPegawai`
  - returns profile for logged-in employee
- `viewDataGajiSinglePegawaiByMonth`
- `viewDataGajiSinglePegawaiByYear`

---

## 11. Backend Models and Data Types

## 11.1 `DataPegawaiModel.js`

Table: `data_pegawai`

Fields:

- `id` (implicit Sequelize primary key in DB)
- `id_pegawai` string UUID-like public/session identifier
- `nik` string(16)
- `nama_pegawai` string(100)
- `username` string(120)
- `password` string
- `jenis_kelamin` string(15)
- `jabatan` string(50)
- `tanggal_masuk` string
- `status` string(50)
- `photo` string(100)
- `url` string
- `hak_akses` string

Purpose:

- stores login-capable users and employee master records

## 11.2 `DataJabatanModel.js`

Table: `data_jabatan`

Fields:

- `id`
- `id_jabatan` UUID-like string
- `nama_jabatan`
- `gaji_pokok`
- `tj_transport`
- `uang_makan`
- `userId`

Associations:

- `DataPegawai.hasMany(DataJabatan)`
- `DataJabatan.belongsTo(DataPegawai, { foreignKey: 'userId' })`

Purpose:

- stores salary package definitions per job role

## 11.3 `DataKehadiranModel.js`

Table: `data_kehadiran`

Fields:

- `id`
- `bulan`
- `nik`
- `nama_pegawai`
- `jenis_kelamin`
- `nama_jabatan`
- `hadir`
- `sakit`
- `alpha`

Purpose:

- stores monthly attendance summaries

## 11.4 `PotonganGajiModel.js`

Table: `potongan_gaji`

Fields:

- `id`
- `potongan`
- `jml_potongan`

Purpose:

- stores named salary deduction rules

## 11.5 `Transaksi.js`

Purpose:

- experimental/helper aggregation file

Status:

- not part of active route/controller pipeline
- appears to be an older or exploratory data-merging file

---

## 12. Database Schema Summary

From `Backend/db/db_penggajian3.sql`, tables present:

- `data_pegawai`
- `data_jabatan`
- `data_kehadiran`
- `potongan_gaji`
- `sessions`

Relationships:

- `data_jabatan.userId -> data_pegawai.id`
- sessions table used by Express session store

Seed examples in dump:

- admin user `Aldi`
- employee user `Budi`
- positions like `HRD` and `Operator Produksi`
- one attendance sample

---

## 13. API Surface

## 13.1 Authentication

- `POST /login`
- `GET /me`
- `DELETE /logout`
- `PATCH /change_password`

## 13.2 Employee Master Data

- `GET /data_pegawai`
- `GET /data_pegawai/id/:id`
- `GET /data_pegawai/nik/:nik`
- `GET /data_pegawai/name/:name`
- `POST /data_pegawai`
- `PATCH /data_pegawai/:id`
- `DELETE /data_pegawai/:id`
- `PATCH /data_pegawai/:id/change_password`

## 13.3 Position Data

- `GET /data_jabatan`
- `GET /data_jabatan/:id`
- `POST /data_jabatan`
- `PATCH /data_jabatan/:id`
- `DELETE /data_jabatan/:id`

## 13.4 Attendance Data

- `GET /data_kehadiran`
- `GET /data_kehadiran/:id`
- `POST /data_kehadiran`
- `PATCH /data_kehadiran/update/:id`
- `DELETE /data_kehadiran/:id`

## 13.5 Deduction Data

- `GET /data_potongan`
- `GET /data_potongan/:id`
- `POST /data_potongan`
- `PATCH /data_potongan/update/:id`
- `DELETE /data_potongan/:id`

## 13.6 Salary Data

- `GET /data_gaji_pegawai`
- `GET /data_gaji/name/:name`
- `GET /data_gaji_pegawai/month/:month`
- `GET /data_gaji_pegawai/year/:year`

## 13.7 Reports

- `GET /laporan/gaji`
- `GET /laporan/gaji/name/:name`
- `GET /laporan/gaji/month/:month`
- `GET /laporan/gaji/year/:year`
- `GET /laporan/absensi/month/:month`
- `GET /laporan/absensi/year/:year`
- `GET /laporan/slip_gaji/name/:name`
- `GET /laporan/slip_gaji/month/:month`
- `GET /laporan/slip_gaji/year/:year`

## 13.8 Employee Self-Service

- `GET /dashboard`
- `GET /data_gaji/month/:month`
- `GET /data_gaji/year/:year`

---

## 14. Frontend Architecture

## 14.1 Entry Files

### `Frontend/src/main.jsx`

Purpose:

- mounts React app
- wraps app in `BrowserRouter`
- enables `axios.defaults.withCredentials = true`

### `Frontend/src/App.jsx`

Purpose:

- delays initial render behind a loading/preloader pattern
- wraps app routes in Redux `Provider`

### `Frontend/src/config/index.jsx`

Purpose:

- re-export convenience file for `Routes` and `store`

## 14.2 Routing

File: `Frontend/src/config/Routes/index.jsx`

Purpose:

- defines entire SPA route tree

Route groups:

- public:
  - `/`
  - `/tentang`
  - `/kontak`
  - `/login`
- shared authenticated:
  - `/dashboard`
- admin:
  - `/data-pegawai`
  - `/data-jabatan`
  - `/data-kehadiran`
  - `/data-potongan`
  - `/data-gaji`
  - `/laporan/gaji`
  - `/laporan/absensi`
  - `/laporan/slip-gaji`
  - `/ubah-password`
- employee:
  - `/data-gaji-pegawai`
  - `/ubah-password-pegawai`
- print routes:
  - `/laporan/gaji/print-page`
  - `/laporan/absensi/print-page`
  - `/laporan/slip-gaji/print-page`
  - `/data-gaji-pegawai/print-page`

Note:

- route protection is mostly done inside page components using `getMe()` and redirect logic rather than a dedicated route guard component.

## 14.3 Layout System

File: `Frontend/src/layout/index.jsx`

Purpose:

- wraps authenticated pages
- conditionally renders:
  - `SidebarAdmin`
  - `SidebarPegawai`
  - `Header`
  - `Footer`

Layout decision driver:

- `state.auth.user.hak_akses`

## 14.4 UI Layering Pattern

The component structure uses:

- `atoms/`
  - small reusable UI pieces
  - buttons, inputs, cards, breadcrumbs, chart wrappers
- `molecules/`
  - larger composites
  - navbar, sidebar, form screens, print templates, header, footer, dashboard body

This is not strict atomic design, but the folder naming follows that idea.

---

## 15. Frontend Page Breakdown

## 15.1 Public Pages

### `pages/Home`

- landing page
- renders `Navbar`, `Banner`, `About`, and `Contact`

### `pages/About`

- company/system overview content
- animated with Framer Motion

### `pages/Contact`

- contact page with EmailJS form submission
- includes static organization contact information

### `pages/Login`

- login screen
- displays branding and `LoginInput`

## 15.2 Shared Dashboard

### `pages/Dashboard`

- dispatches `getMe()`
- redirects to `/login` on auth error
- renders `DefaultDashboard`

### `components/molecules/DefaultDashboard`

- admin view:
  - summary cards
  - charts
- employee view:
  - personal profile card using employee data lookup

## 15.3 Admin Pages

Main folder: `Frontend/src/pages/Admin`

Feature groups:

- `MasterData`
  - `DataPegawai`
  - `DataJabatan`
- `Transaksi`
  - `DataKehadiran`
  - `DataPotongan`
  - `DataGaji`
- `Laporan`
  - `LaporanGaji`
  - `LaporanAbsensi`
  - `SlipGaji`
- `PengaturanAdmin`
  - `UbahPasswordAdmin`

These pages generally:

- call `getMe()`
- redirect unauthenticated users to `/login`
- pull data through Redux actions
- render tables/forms/actions

## 15.4 Employee Pages

Main folder: `Frontend/src/pages/Pegawai`

Feature groups:

- `DataGajiPegawai`
- `PengaturanPegawai/UbahPasswordPegawai`

Purpose:

- employee self-service salary access
- self password change

---

## 16. Redux Architecture

## 16.1 Store

File: `Frontend/src/config/redux/store.js`

Slices registered:

- `auth`
- `dataGajiPegawaiPrint`
- `dataPegawai`
- `dataJabatan`
- `dataKehadiran`
- `dataPotongan`
- `dataGaji`
- `laporanAbsensi`
- `laporanGaji`
- `slipGaji`
- `ubahPassword`

## 16.2 Auth State

Files:

- `action/authAction/index.js`
- `reducer/authReducer/index.js`

Responsibilities:

- login request
- fetch current user
- logout request
- auth state flags:
  - `user`
  - `isError`
  - `isSuccess`
  - `isLoading`
  - `message`

## 16.3 Feature Actions

Redux action folders mirror business features:

- `dataPegawaiAction`
- `dataJabatanAction`
- `dataKehadiranAction`
- `dataPotonganAction`
- `dataGajiAction`
- `laporanGajiAction`
- `laporanAbsensiAction`
- `slipGajiAction`
- `dataGajiPegawaiPrintAction`
- `ubahPasswordAction`

Behavior pattern:

- many use Axios directly inside thunk-like functions
- some use Redux Toolkit `createAsyncThunk`
- some use classic dispatch of string constants

This means the Redux layer is **mixed-style**, not fully standardized.

---

## 17. Key Frontend Components

## 17.1 Navigation

- `components/molecules/Navbar`
  - public site navigation
  - mobile drawer
  - dark mode toggle
  - login CTA
- `components/molecules/Sidebar/SidebarAdmin`
  - admin navigation tree
- `components/molecules/Sidebar/SidebarPegawai`
  - employee navigation tree
- `components/molecules/Header`
  - authenticated top bar with theme toggle and profile menu

## 17.2 Forms

Form folders under:

- `components/molecules/Form/FormDataPegawai`
- `components/molecules/Form/FormDataJabatan`
- `components/molecules/Form/FormDataKehadiran`
- `components/molecules/Form/FormDataPotongan`

Purpose:

- add/edit flows for admin-managed entities

## 17.3 Print Components

Print templates live under:

- `components/molecules/PrintPdf/PrintPdfSlipGaji`
- `components/molecules/PrintPdf/PrintPdfLaporanGaji`
- `components/molecules/PrintPdf/PrintPdfLaporanAbsensi`
- `components/molecules/PrintPdf/PrintPdfDataGajiPegawai`

Purpose:

- render report-oriented printable views

## 17.4 Dashboard Widgets

- `atoms/Card/*`
- `atoms/Chart/*`

Purpose:

- summary counts and visual overview for admin dashboard

---

## 18. Hooks, Styling, and Assets

## 18.1 Hooks

- `hooks/useColorMode`
  - toggles `dark` class on body
- `hooks/useLocalStorage`
  - generic localStorage-backed state helper
- `hooks/useAnimation`
  - shared Framer Motion animation configs

## 18.2 Styling

- `src/index.css`
  - Tailwind layers and utility overrides
  - ApexCharts and third-party style adjustments
- `src/satoshi.css`
  - custom font setup
- `src/shared/Shared.css`
  - shared page styling
- `Frontend/tailwind.config.cjs`
  - custom theme, colors, spacing, screens, shadows

## 18.3 Assets

`src/Assets/` contains:

- logos
- icons
- images
- fonts
- helper JS files

Purpose:

- all static UI resources used by the landing pages and dashboard UI

---

## 19. Use Cases

## 19.1 Admin Use Cases

1. Log into the system.
2. View dashboard summary.
3. Add a new employee with photo and role.
4. Manage positions and salary component values.
5. Record attendance for employees.
6. Define deduction amounts for absence types.
7. View computed salary data.
8. Filter salary/attendance reports.
9. Print reports and payslips.
10. Change own password or employee password.

## 19.2 Employee Use Cases

1. Log into the system.
2. View own dashboard/profile.
3. View own salary data by month/year.
4. Print own salary data.
5. Change own password.
6. Log out.

---

## 20. End-to-End Use Flows

## 20.1 Admin Payroll Setup Flow

```text
Admin login
  -> create/manage employee records
  -> create/manage job records
  -> create/manage deduction rules
  -> input attendance
  -> open salary data
  -> system computes payroll from joined datasets
  -> admin prints reports/slips
```

## 20.2 Employee Self-Service Flow

```text
Employee login
  -> backend session created
  -> frontend loads /dashboard and /me
  -> employee profile displayed
  -> employee opens salary page
  -> frontend requests salary data
  -> employee filters / prints salary output
```

## 20.3 Salary Calculation Flow

```text
Employee master data
  + Position data
  + Attendance data
  + Deduction rules
    -> TransaksiController.getDataGajiPegawai()
      -> salary rows
      -> report rows
      -> slip rows
```

---

## 21. File-by-File Importance Map

This section explains the most important files and why they exist.

### Root files

- `README.md`
  - project overview, features, stack, screenshots, basic setup
- `SECURITY.md`
  - repository-level security guidance
- `LICENSE`
  - MIT license

### Backend core files

- `Backend/index.js`
  - main server bootstrap
- `Backend/config/Database.js`
  - Sequelize DB connection
- `Backend/middleware/AuthUser.js`
  - auth and role protection
- `Backend/routes/AuthRoute.js`
  - auth endpoints
- `Backend/routes/UserRoute.js`
  - application business endpoints

### Backend business files

- `Backend/controllers/Auth.js`
  - login/session/password management
- `Backend/controllers/DataPegawai.js`
  - employee CRUD
- `Backend/controllers/DataJabatan.js`
  - job CRUD
- `Backend/controllers/TransaksiController.js`
  - attendance, deductions, payroll engine
- `Backend/controllers/LaporanController.js`
  - report filtering and formatting
- `Backend/controllers/Pegawai.js`
  - employee-specific dashboard/salary endpoints

### Backend data files

- `Backend/models/*.js`
  - Sequelize table definitions
- `Backend/db/db_penggajian3.sql`
  - schema + seed dump
- `Backend/request_test/*.rest`
  - manual API request examples for testing
- `Backend/Note.txt`
  - older backend route notes

### Frontend core files

- `Frontend/src/main.jsx`
  - React app bootstrap
- `Frontend/src/App.jsx`
  - loading gate + Redux provider
- `Frontend/src/config/Routes/index.jsx`
  - all route definitions
- `Frontend/src/config/redux/store.js`
  - Redux store assembly
- `Frontend/src/layout/index.jsx`
  - authenticated page shell

### Frontend page files

- `Frontend/src/pages/Home/index.jsx`
  - public landing assembly
- `Frontend/src/pages/Login/index.jsx`
  - login page shell
- `Frontend/src/pages/Dashboard/index.jsx`
  - auth-check wrapper for dashboard
- `Frontend/src/pages/Admin/...`
  - admin functional screens
- `Frontend/src/pages/Pegawai/...`
  - employee functional screens

### Frontend component files

- `components/molecules/Navbar`
  - public nav
- `components/molecules/Sidebar/*`
  - role-specific private nav
- `components/molecules/DefaultDashboard`
  - main dashboard content by role
- `components/molecules/Form/*`
  - CRUD forms
- `components/molecules/PrintPdf/*`
  - printable report renderers

### Frontend support files

- `hooks/*`
  - local UX support
- `tailwind.config.cjs`
  - design tokens and Tailwind config
- `vite.config.js`
  - Vite setup

---

## 22. Technical Observations and Architecture Notes

## 22.1 Strong Parts

- clear separation between frontend and backend
- role-aware UI and API behavior
- payroll logic centralized in backend controller
- SQL dump included for easier local setup
- request collection files help manual endpoint testing
- print flows are explicitly modeled

## 22.2 Notable Inconsistencies

- project is called `MERN`, but database is MySQL, not MongoDB
- frontend mixes Redux Toolkit async thunks with classic Redux action constants
- many frontend API URLs are hardcoded instead of using env config
- several frontend actions use `PUT` while backend routes define `PATCH`
- some routes are protected inconsistently or rely on page-level auth checks
- some case differences exist in import paths/assets naming, which may be fine on Windows but can fail on case-sensitive systems

## 22.3 Logic/Design Risks Visible in Code

- `Backend/config/Database.js` hardcodes credentials
- some backend routes expose computed salary data without auth middleware
- `DataKehadiran` creation prevents duplicate names globally, not clearly per month/year
- some helper code refers to fields inconsistently, for example `jabatan` vs `jabatan_pegawai`
- `Backend/models/Transaksi.js` looks unused/legacy
- no automated tests or validation layer

These are not just style notes; they affect maintainability and deployment readiness.

---

## 23. Missing or Unimplemented Formal Artifacts

Not found in repo:

- formal BRD document
- formal FRD document
- formal SRS document
- ER diagram image
- sequence diagrams
- API OpenAPI/Swagger spec
- deployment guide
- test plan
- CI pipeline config

This `PROJECT_CONTEXT.md` acts as the closest consolidated project knowledge base currently available in the repository.

---

## 24. Practical Mental Model of the App

If you want to understand the app quickly, think of it in this order:

1. `data_pegawai`
   - who the users/employees are
2. `data_jabatan`
   - how much each role pays
3. `data_kehadiran`
   - what monthly attendance looks like
4. `potongan_gaji`
   - deduction rules for attendance issues
5. `TransaksiController.getDataGajiPegawai()`
   - where the system turns raw business data into payroll output
6. report/slip endpoints
   - where computed payroll is filtered for different views
7. React routes/pages/forms
   - where each role consumes and manages that data

---

## 25. Suggested Reading Order for Future Developers

For fastest onboarding, read files in this order:

1. `README.md`
2. `Backend/index.js`
3. `Backend/routes/UserRoute.js`
4. `Backend/controllers/TransaksiController.js`
5. `Backend/models/*.js`
6. `Backend/db/db_penggajian3.sql`
7. `Frontend/src/config/Routes/index.jsx`
8. `Frontend/src/layout/index.jsx`
9. `Frontend/src/config/redux/store.js`
10. `Frontend/src/pages/Dashboard/index.jsx`
11. `Frontend/src/components/molecules/DefaultDashboard/index.jsx`
12. feature pages/forms for the module you want to change

---

## 26. Final Context Summary

SiPeKa is a React + Express + MySQL payroll management application with session-based authentication and two roles: admin and employee. The backend stores employee, position, attendance, and deduction data, then computes payroll dynamically in controller logic. The frontend provides a public landing page plus a role-specific private dashboard and CRUD/reporting flows. The repo contains enough implementation detail to infer the product requirements and architecture, but it does not contain formal business/functional/software requirement documents, so those have been reconstructed here from the codebase itself.
