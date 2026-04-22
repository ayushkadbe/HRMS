OVERTIME FEATURE PLAN

PHASE 1 (COMPLETED):
- Treat Site Manager workflow as Admin capability under `Transactions`.
- Added overtime entry, listing, and approval/reject flow.
- Enforced frontend and backend validation rules.
- Added duplicate and monthly cap checks in API.

PHASE 2 (PAYROLL INTEGRATION):
- Integrate approved overtime into salary calculation.
- Show overtime data in Admin salary table and Employee salary table.
- Include overtime fields in salary detail and salary print exports.

PHASE 2 IMPLEMENTATION NOTES:
- Overtime source: `data_lembur` with `status = approved`.
- Grouping key: worker + month + year.
- Formula:
  - `total_jam_lembur_bulan = SUM(jam_lembur approved)`
  - `tarif_lembur_per_jam = (gaji_pokok / 30 / 8) * overtime_multiplier`
  - `uang_lembur = total_jam_lembur_bulan * tarif_lembur_per_jam`
  - `total_gaji = gaji_pokok + tj_transport + uang_makan - potongan + uang_lembur`
- API response extension:
  - `jam_lembur`
  - `lembur`
- UI extension:
  - Add `Overtime Hours` and `Overtime Pay` columns where salary data is shown.

PHASE 2.2 (RATE ADJUSTMENT):
- Replaced fixed overtime rate with derived employee-specific hourly rate from monthly base salary.
- Current backend policy constant:
  - `overtime_multiplier = 1` (can be changed later for legal/company policy).
- Effective calculation now aligns overtime amount with each employee's own `gaji_pokok`.

PHASE 3 (SITE MANAGER ROLE SPLIT):
- Added `site_manager` as a dedicated app access role (`hak_akses`) for overtime operations.
- Site Manager can:
  - View overtime list
  - Create overtime entries
- Site Manager cannot:
  - Approve/reject overtime
  - Access payroll/salary update screens
  - Access admin master/report modules
- Admin remains the only role allowed to approve/reject overtime and manage payroll calculations.

PHASE 3.1 (SITE ADMIN ROLE UPDATE - MINIMAL CHANGES):
- Introduced `site_admin` as operational role in `hak_akses` dropdown.
- `site_admin` can access:
  - Dashboard (admin-style summary cards/charts)
  - Master Data pages (view-only)
  - Transaction pages for Attendance (view-only) and Overtime (create/view)
- `site_admin` cannot:
  - Create/update/delete master data records
  - Approve/reject/delete overtime requests
  - Access payroll and reports modules
- Overtime approval and payroll impact remain admin-only.

PHASE 3.2 (SITE MANAGER MENU ALIGNMENT):
- `site_manager` now shares the same operational shell access as `site_admin`:
  - Dashboard with admin-style cards/charts
  - Master Data and Transactions groups visible in sidebar
- `site_manager` still remains restricted from approval/payroll controls:
  - cannot approve/reject/delete overtime
  - payroll and reports remain admin-only
- Additional UI rule:
  - `Position Data` tab is hidden for `site_manager`
  - direct access to `Position Data` page is blocked for `site_manager`
