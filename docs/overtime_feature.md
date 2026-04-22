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
