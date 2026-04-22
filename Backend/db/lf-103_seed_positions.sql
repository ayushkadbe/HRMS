USE db_penggajian3;

-- LF-103 seed positions requested by the ticket.
-- Salary-related values are minimal placeholders so these rows satisfy the current schema;
-- update them in Position Data if your business values differ.
INSERT INTO data_jabatan (
  id_jabatan,
  nama_jabatan,
  gaji_pokok,
  tj_transport,
  uang_makan,
  userId,
  createdAt,
  updatedAt
)
SELECT UUID(), seed.nama_jabatan, 1, 1, 1, admin_user.id, NOW(), NOW()
FROM (
  SELECT 'Mason' AS nama_jabatan
  UNION ALL SELECT 'Electrician'
  UNION ALL SELECT 'Plumber'
  UNION ALL SELECT 'Supervisor'
  UNION ALL SELECT 'Helper'
) AS seed
CROSS JOIN (
  SELECT id
  FROM data_pegawai
  WHERE hak_akses IN ('admin', 'site_admin', 'site_manager')
  ORDER BY id
  LIMIT 1
) AS admin_user
WHERE NOT EXISTS (
  SELECT 1
  FROM data_jabatan existing_jabatan
  WHERE existing_jabatan.nama_jabatan = seed.nama_jabatan
);
