LOGIN TO MYSQL:
mysql -u root -p

CREATE DATABASE:
CREATE DATABASE db_penggajian3;
EXIT;

UPDATE:
Database.js with mysql credentials

IMPORT DATABASE:

```powershell
Get-Content .\Backend\db\db_penggajian3.sql | mysql -u root -p db_penggajian3
```

Then enter your MySQL password when prompted.

After that, verify inside MySQL with:

```sql
USE db_penggajian3;
SHOW TABLES;
SELECT username, hak_akses FROM data_pegawai;
```

You should then be able to log in with:

- `aldi / update`
- `budi / update`

RESET PASSWORD FEATURE:

No register new option available, so use reset-password.js to create new password for user.

Inside /Backend > run node reset-password.js

OVERTIME FEATURE TABLE:

CREATE:

CREATE TABLE data_lembur (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pegawai_id INT NOT NULL,
  nik VARCHAR(16) NOT NULL,
  nama_pegawai VARCHAR(100) NOT NULL,
  tanggal_lembur DATE NOT NULL,
  jam_lembur INT NOT NULL,
  alasan VARCHAR(255) NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  approved_by VARCHAR(100) NULL,
  approved_at DATETIME NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pegawai_tanggal (pegawai_id, tanggal_lembur),
  KEY idx_pegawai_tanggal_status (pegawai_id, tanggal_lembur, status)
);

PHASE 1 (DUPLICATION FLOW) - DB COMMANDS USED:

1) Login:

```bash
mysql -u root -p
```

2) Select database:

```sql
USE db_penggajian3;
```

3) Create overtime table:

```sql
CREATE TABLE data_lembur (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pegawai_id INT NOT NULL,
  nik VARCHAR(16) NOT NULL,
  nama_pegawai VARCHAR(100) NOT NULL,
  tanggal_lembur DATE NOT NULL,
  jam_lembur INT NOT NULL,
  alasan VARCHAR(255) NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  approved_by VARCHAR(100) NULL,
  approved_at DATETIME NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pegawai_tanggal (pegawai_id, tanggal_lembur),
  KEY idx_pegawai_tanggal_status (pegawai_id, tanggal_lembur, status)
);
```

4) Verify schema and initial data:

```sql
DESCRIBE data_lembur;
SHOW INDEX FROM data_lembur;
SELECT * FROM data_lembur;
```

5) If table already exists:

```sql
SHOW TABLES LIKE 'data_lembur';
```

If needed to recreate from scratch:

```sql
DROP TABLE data_lembur;
```

Then run CREATE TABLE again.

MYSQL PASSWORD TROUBLESHOOTING:

- This project database credentials are in `Backend/config/Database.js`
- Current setup uses:
  - DB: `db_penggajian3`
  - User: `root`
  - Password: `KDWheaven`
- If phpMyAdmin/CMD prompts for a password or denies access, use the password from `Database.js` to keep runtime and CLI credentials aligned.
