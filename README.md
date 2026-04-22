# React Assignment

## Chosen HRMS

I used the open-source [MERN Employee Salary Management](https://github.com/berthutapea/mern-employee-salary-management) repository because it already has a React frontend, Node/Express backend, and payroll-focused flows that fit the assignment well.

## What I Built

### Part 1: Overtime Entry and Approval

Implemented an overtime workflow for site workers with:

- Overtime entry form for selecting an employee, date, hours, and reason
- Frontend validation before submission
- Backend validation on the API
- Duplicate overtime prevention per worker and date
- Monthly overtime cap validation
- Approval and rejection flow for overtime records
- Payroll integration so approved overtime contributes to salary output

### Part 2: Ticket Blitz

Implemented the following tickets as separate commits:

- `LF-101`: Payslip dates changed to `DD/MM/YYYY`
- `LF-102`: Negative salary and deduction amounts blocked with frontend and backend validation
- `LF-103`: Employee designation uses the existing Position Data source as a dropdown and is shown in the employee list
- `LF-104`: Employee list CSV export added
- `LF-105`: Employee list mobile layout improved with stacked and horizontal mobile-friendly views

## Quick Start

### Prerequisites

- Node.js 18+ recommended
- MySQL
- npm

### 1. Clone the repository

```bash
git clone <your-fork-url>
cd mern-employee-salary-management-main
```

### 2. Import the updated database

Import the assignment-ready database dump before starting the app.

The database import file is:

- `Backend/db/db_penggajian3.sql`

This file has been replaced with an updated dump from the current working assignment database so reviewers can load the latest app state directly.

Recommended import flow:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE db_penggajian3;
EXIT;
```

Then import:

```bash
Get-Content .\Backend\db\db_penggajian3.sql | mysql -u root -p db_penggajian3
```

After import, optional implementation and review notes are available in:

- `docs/DB_report.md`

That file documents the database work done during the assignment, including:

- overtime table creation
- role updates for `site_manager` / `site_admin`
- login/password notes
- verification SQL

Important note:

- `Backend/db/db_penggajian3.sql` is now the updated assignment dump, not the old upstream base dump
- `docs/DB_report.md` is supporting documentation for the database changes made during implementation
- session data is not meant to be reviewed as seeded user data

### 3. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` with the required environment variables:

```env
APP_PORT=5000
SESS_SECRET=your_session_secret
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
DB_HOST=localhost
```

Start the backend:

```bash
npm start
```

### 4. Set up the frontend

Open a second terminal:

```bash
cd Frontend
npm install
npm run dev
```

### 5. Access the app

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Review login credentials

Use these credentials to review the updated app:

Role: username / password

- `admin`: `aldi / admin`
- `employee`: `budi / employee`
- `site manager`: `tony / sitemanager`

## AI Tools Used

I used OpenAI Codex, Antigrativity, Cursor, Github Copilot to:

- understand unfamiliar parts of the codebase faster
- review controller, route, and frontend form flows
- help debug rebase and commit-history cleanup
- draft and refine commit messages
- generate and improve documentation and review notes

All code changes were reviewed in the local repository and adjusted to fit the existing project structure rather than rewriting the app.

## Tickets Handled Differently

- `LF-103`: Instead of introducing a brand-new hardcoded designation enum, I used the repo's existing `Position Data` (`data_jabatan`) as the dropdown source. That matches the existing data model and keeps employee designations aligned with salary/position records already used by the application.
- `LF-104`: The assignment asks for `name, designation, department, salary`. This repo does not have a separate department field on the employee model, so the CSV export includes the available equivalent fields already modeled in the system: employee name, position/designation, and salary.

## Commit Structure

The branch is organized so that:

- overtime feature work is in separate commit(s)
- each ticket `LF-101` through `LF-105` is in its own commit

High-level sequence:

- documentation/context setup for understanding the inherited repo
- baseline repo fixes needed to make the project workable locally
- overtime feature commits
- individual LF-101 to LF-105 ticket commits
- small follow-up fixes and cleanup commits where needed

**Additional non-ticket work done to support delivery:**

- image upload fix on employee creation
- temporary password reset support for easier local access to inherited seed accounts
- project-context documentation because the original repo did not include assignment-friendly system context
- compatibility/cleanup fixes for issues encountered while working through the older codebase

These were kept separate from the LF ticket commits so the requested ticket history remains easy to review.

## Notes

- Additional implementation notes and feature writeups are included under `docs/`
- LF ticket quick summaries are documented in `docs/LF_Ticket_report.md`
- Overtime planning notes are documented in `docs/overtime_feature_plan.md`
- This submission intentionally works within the existing patterns of the chosen HRMS instead of rewriting the architecture
