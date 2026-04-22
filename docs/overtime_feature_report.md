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
