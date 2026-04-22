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