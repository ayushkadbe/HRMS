# DB Report

This document records only the database-related changes made during the assignment.

## Overtime Feature DB Changes

### 1. Added `data_lembur` table

Created a new overtime table to store worker overtime submissions.

Main fields:

- `pegawai_id`
- `nik`
- `nama_pegawai`
- `tanggal_lembur`
- `jam_lembur`
- `alasan`
- `status`
- `approved_by`
- `approved_at`

### 2. Added uniqueness constraint

Added a unique constraint so one worker cannot have duplicate overtime rows for the same date.

- `UNIQUE KEY uq_pegawai_tanggal (pegawai_id, tanggal_lembur)`

### 3. Added lookup index

Added a supporting index for worker/date/status lookups used by validation and reporting.

- `KEY idx_pegawai_tanggal_status (pegawai_id, tanggal_lembur, status)`

### 4. Payroll integration behavior

No new table was required for overtime payroll integration after the initial `data_lembur` creation.

Approved overtime rows from `data_lembur` are aggregated by worker + month and used in salary calculation.

## LF Ticket DB Changes

### LF-102

No schema change was required.

The fix was validation-based:

- salary-related amount fields are now rejected if non-positive
- deduction amounts are now rejected if non-positive

### LF-103

No new employee designation table was added.

Instead, the existing `data_jabatan` structure was reused as the designation source.

Supporting data work:

- added/used position seed data so requested designation-like values can be selected from `Position Data`

### LF-104

No schema change was required.

CSV export uses existing employee and position-related data already stored in the system.

### LF-105

No schema change was required.

This was a frontend-only responsive layout fix.

### LF-101

No schema change was required.

This was a frontend formatting fix only.

## Role / Access DB Notes

No new access-control table was introduced.

Role-related work reused the existing `data_pegawai.hak_akses` field for:

- `admin`
- `pegawai`
- `site_manager`
- `site_admin`

## Final Assignment DB State

The current assignment-ready database dump is:

- `Backend/db/db_penggajian3.sql`

That updated dump already contains:

- the overtime table
- current employee data used for review
- current role data used for review
- current assignment data state excluding seeded session review data
