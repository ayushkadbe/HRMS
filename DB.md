mysql -u root -p

Run this one command from the repo terminal:

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
