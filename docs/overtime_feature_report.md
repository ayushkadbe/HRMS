PHASE 1:


### What I changed

* Added overtime data model: `<span class="md-inline-path-prefix">Backend/models/</span><span class="md-inline-path-filename">DataLemburModel.js</span>`
* Added backend overtime APIs in `<span class="md-inline-path-prefix">Backend/controllers/</span><span class="md-inline-path-filename">TransaksiController.js</span>`:
  * `viewDataLembur`
  * `viewDataLemburByID`
  * `createDataLembur`
  * `approveDataLembur`
  * `rejectDataLembur`
  * `deleteDataLembur`
* Added backend overtime routes in `<span class="md-inline-path-prefix">Backend/routes/</span><span class="md-inline-path-filename">UserRoute.js</span>`:
  * `GET /data_lembur`
  * `GET /data_lembur/:id`
  * `POST /data_lembur`
  * `PATCH /data_lembur/:id/approve`
  * `PATCH /data_lembur/:id/reject`
  * `DELETE /data_lembur/:id`

### Backend validations implemented

* Required fields (`pegawai_id`, `tanggal_lembur`, `jam_lembur`, `alasan`)
* `jam_lembur` must be integer between 1 and 6
* `tanggal_lembur` not in future
* `tanggal_lembur` not older than 7 days
* `alasan` minimum 10 chars
* Worker existence check in `data_pegawai`
* Duplicate check for same `pegawai_id + tanggal_lembur`
* Monthly limit check: rejects when total (pending + approved) would exceed 60 hours

### Frontend UI implemented

* New overtime list/admin page: `<span class="md-inline-path-prefix">Frontend/src/pages/Admin/Transaksi/DataLembur/</span><span class="md-inline-path-filename">index.jsx</span>`
  * Search by employee name
  * Filter by status
  * Approve/Reject for pending entries
  * Delete entry
* New overtime add form: `<span class="md-inline-path-prefix">Frontend/src/components/molecules/Form/FormDataLembur/FormAddDataLembur/</span><span class="md-inline-path-filename">index.jsx</span>`
  * Worker select from employee list
  * Date input with 7-day window
  * Hours input 1..6
  * Reason min 10 chars
  * Frontend validation + backend error handling

### App wiring updates

* Route registration: `<span class="md-inline-path-prefix">Frontend/src/config/Routes/</span><span class="md-inline-path-filename">index.jsx</span>`
* Admin page export: `<span class="md-inline-path-prefix">Frontend/src/pages/Admin/</span><span class="md-inline-path-filename">index.jsx</span>`
* Component export: `<span class="md-inline-path-prefix">Frontend/src/components/molecules/</span><span class="md-inline-path-filename">index.jsx</span>`
* Admin sidebar menu item (**Overtime Data**): `<span class="md-inline-path-prefix">Frontend/src/components/molecules/Sidebar/SidebarAdmin/</span><span class="md-inline-path-filename">index.jsx</span>`

### DB docs updated

* Appended Phase 1 DB command section in `<span class="md-inline-path-filename">DB.md</span>`:
  * exact SQL used
  * verify commands (`DESCRIBE`, `SHOW INDEX`, `SELECT`)
  * recreate guidance
  * password troubleshooting referencing `<span class="md-inline-path-prefix">Backend/config/</span><span class="md-inline-path-filename">Database.js</span>`

### Validation check

* Ran linter diagnostics on edited files; no linter errors reported.

PHASE 2:

### What I changed

* Integrated approved overtime into payroll calculation in `<span class="md-inline-path-prefix">Backend/controllers/</span><span class="md-inline-path-filename">TransaksiController.js</span>`:
  * Added overtime aggregation helper (`getDataLemburApproved`)
  * Added overtime constants and month mapping
  * Added `jam_lembur` and `lembur` fields to salary payload
  * Updated total salary formula to include overtime pay
* Extended salary-related response mappers to return overtime fields:
  * `<span class="md-inline-path-prefix">Backend/controllers/</span><span class="md-inline-path-filename">TransaksiController.js</span>`
  * `<span class="md-inline-path-prefix">Backend/controllers/</span><span class="md-inline-path-filename">Pegawai.js</span>`
  * `<span class="md-inline-path-prefix">Backend/controllers/</span><span class="md-inline-path-filename">LaporanController.js</span>`
* Updated admin salary UI to show overtime columns:
  * `<span class="md-inline-path-prefix">Frontend/src/pages/Admin/Transaksi/DataGaji/</span><span class="md-inline-path-filename">index.jsx</span>`
* Updated employee salary UI to show overtime columns:
  * `<span class="md-inline-path-prefix">Frontend/src/pages/Pegawai/DataGajiPegawai/</span><span class="md-inline-path-filename">index.jsx</span>`
* Updated salary detail + print templates to include overtime:
  * `<span class="md-inline-path-prefix">Frontend/src/components/molecules/DetailDataGaji/</span><span class="md-inline-path-filename">index.jsx</span>`
  * `<span class="md-inline-path-prefix">Frontend/src/components/molecules/PrintPdf/PrintPdfSlipGaji/</span><span class="md-inline-path-filename">index.jsx</span>`
  * `<span class="md-inline-path-prefix">Frontend/src/components/molecules/PrintPdf/PrintPdfLaporanGaji/</span><span class="md-inline-path-filename">index.jsx</span>`

### DB and docs updates

* Updated `<span class="md-inline-path-prefix">docs/</span><span class="md-inline-path-filename">overtime_feature.md</span>` with Phase 2 scope and formula.
* Updated `<span class="md-inline-path-prefix">docs/</span><span class="md-inline-path-filename">DB.md</span>` with Phase 2 verification queries and implementation notes.

PHASE 2.2:

### What I changed

* Updated overtime pay calculation policy in `<span class="md-inline-path-prefix">Backend/controllers/</span><span class="md-inline-path-filename">TransaksiController.js</span>`:
  * Removed fixed per-hour constant strategy.
  * Added derived hourly overtime rate per employee:
    * `tarif_lembur_per_jam = gaji_pokok / 30 / 8`
    * `overtime_multiplier = 1` (policy constant)
  * Updated overtime amount formula:
    * `uang_lembur = total_jam_lembur_bulan * tarif_lembur_per_jam`
* Kept API fields unchanged (`jam_lembur`, `lembur`) so frontend screens continue to work without payload contract changes.

### Docs updates

* Updated `<span class="md-inline-path-prefix">docs/</span><span class="md-inline-path-filename">overtime_feature.md</span>` with Phase 2.2 rate-adjustment notes.
* Updated `<span class="md-inline-path-prefix">docs/</span><span class="md-inline-path-filename">DB.md</span>` to reflect formula-based overtime rate and no schema change.

PHASE 3:

### What I changed

* Added backend role guard `adminOrSiteManager` in `<span class="md-inline-path-prefix">Backend/middleware/</span><span class="md-inline-path-filename">AuthUser.js</span>`.
* Updated overtime routes in `<span class="md-inline-path-prefix">Backend/routes/</span><span class="md-inline-path-filename">UserRoute.js</span>`:
  * `GET/POST data_lembur` now accessible for `admin` and `site_manager`.
  * `approve/reject/delete data_lembur` remains `admin` only.
* Updated layout role handling in `<span class="md-inline-path-prefix">Frontend/src/layout/</span><span class="md-inline-path-filename">index.jsx</span>` so `site_manager` uses the admin-style sidebar shell.
* Updated sidebar visibility rules in `<span class="md-inline-path-prefix">Frontend/src/components/molecules/Sidebar/SidebarAdmin/</span><span class="md-inline-path-filename">index.jsx</span>`:
  * Site Manager only sees `Overtime Data` under transactions.
  * Master Data, Attendance, Deduction, Salary, and Reports remain hidden for site manager.
* Updated overtime page guards/actions:
  * `<span class="md-inline-path-prefix">Frontend/src/pages/Admin/Transaksi/DataLembur/</span><span class="md-inline-path-filename">index.jsx</span>` now allows `site_manager` access, but approve/reject/delete actions are only visible to admin.
  * `<span class="md-inline-path-prefix">Frontend/src/components/molecules/Form/FormDataLembur/FormAddDataLembur/</span><span class="md-inline-path-filename">index.jsx</span>` now allows `site_manager` access.
* Added `site_manager` option to employee access dropdowns:
  * `<span class="md-inline-path-prefix">Frontend/src/components/molecules/Form/FormDataPegawai/FormAddDataPegawai/</span><span class="md-inline-path-filename">index.jsx</span>`
  * `<span class="md-inline-path-prefix">Frontend/src/components/molecules/Form/FormDataPegawai/FormEditDataPegawai/</span><span class="md-inline-path-filename">index.jsx</span>`

### Docs updates

* Updated `<span class="md-inline-path-prefix">docs/</span><span class="md-inline-path-filename">overtime_feature.md</span>` with Phase 3 scope and access policy.
* Updated `<span class="md-inline-path-prefix">docs/</span><span class="md-inline-path-filename">DB.md</span>` with role verification/update SQL for `site_manager`.

PHASE 3.1:

### What I changed

* Updated role handling to support `site_admin` with minimal new code.
* Backend access control updates:
  * `<span class="md-inline-path-prefix">Backend/middleware/</span><span class="md-inline-path-filename">AuthUser.js</span>` now allows `site_admin` in `adminOrSiteManager` middleware.
  * `<span class="md-inline-path-prefix">Backend/routes/</span><span class="md-inline-path-filename">UserRoute.js</span>` now allows `site_admin` read access to:
    * `GET /data_pegawai`
    * `GET /data_jabatan`
    * `GET /data_kehadiran`
    * existing overtime create/view routes
* Frontend operational-role behavior:
  * `<span class="md-inline-path-prefix">Frontend/src/components/molecules/DefaultDashboard/</span><span class="md-inline-path-filename">index.jsx</span>` shows admin-style dashboard widgets for `site_admin`.
  * `<span class="md-inline-path-prefix">Frontend/src/components/molecules/Sidebar/SidebarAdmin/</span><span class="md-inline-path-filename">index.jsx</span>` shows Master Data + Transactions menu for `site_admin`, while payroll/reports remain hidden.
  * `<span class="md-inline-path-prefix">Frontend/src/pages/Admin/MasterData/DataPegawai/</span><span class="md-inline-path-filename">index.jsx</span>` and `<span class="md-inline-path-prefix">DataJabatan/</span><span class="md-inline-path-filename">index.jsx</span>` allow `site_admin` view-only access (create/edit/delete hidden).
  * `<span class="md-inline-path-prefix">Frontend/src/pages/Admin/Transaksi/DataKehadiran/</span><span class="md-inline-path-filename">index.jsx</span>` allows `site_admin` view-only access.
  * Overtime form/list now accept `site_admin` role guards while approval actions stay admin-only.
* Employee form role option update:
  * Added `site_admin` option in add/edit employee forms.

### Docs updates

* Updated `<span class="md-inline-path-prefix">docs/</span><span class="md-inline-path-filename">overtime_feature.md</span>` with Phase 3.1 role policy.
* Updated `<span class="md-inline-path-prefix">docs/</span><span class="md-inline-path-filename">DB.md</span>` with migration SQL from `site_manager` to `site_admin`.

PHASE 3.2:

### What I changed

* Aligned `site_manager` menu/dashboard visibility with operational role expectations:
  * Dashboard cards/charts are now visible for `site_manager`.
  * Master Data + Transactions groups are available for `site_manager`.
* Kept restricted actions unchanged:
  * approve/reject/delete overtime remain admin-only.
  * payroll/report modules remain admin-only.
* Added targeted restriction for `site_manager`:
  * `Position Data` menu hidden in sidebar.
  * direct page access to `Position Data` blocked for `site_manager`.

### Docs updates

* Updated `<span class="md-inline-path-prefix">docs/</span><span class="md-inline-path-filename">overtime_feature.md</span>` with Phase 3.2 alignment notes.
