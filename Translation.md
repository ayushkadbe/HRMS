To change the Indonesian text to English in the frontend without affecting any logic, you will need to update the static text within the React components. Since there isn't a localization library (like `react-i18next`) being used, the text is hardcoded directly into the `.jsx` files.

Here are the main folders and files you should look into to translate the text:

### 1. UI Components (`Frontend/src/components`)

These files contain reusable UI elements like menus, footers, and headers which appear across multiple pages.

* **`SidebarAdmin/index.jsx` & `SidebarPegawai/index.jsx`**: Contains the navigation menu items (e.g., "Dashboard", "Master Data", "Data Pegawai", "Laporan").
* **`Header/index.jsx` & `Navbar/index.jsx`**: Contains top navigation text, user profile dropdown text ("Log Out", etc.).
* **`Footer/index.jsx`**: Copyright text and links at the bottom.
* **`LoginInput/index.jsx`**: The login form labels, placeholders ("Masukkan Username"), and button text ("Masuk").
* **Other Components**: Check `Banner`, `Breadcrumb`, and any modals/alerts in `atoms` or `molecules` for static text.

### 2. Page Components (`Frontend/src/pages`)

These are the actual screens of the application. You will need to go through each `.jsx` file in these folders and translate the page titles, table headers, button labels, and paragraph text.

* **`Login/index.jsx`**: The main login page text (e.g., "Sistem Penggajian Karyawan Online").
* **`Home/index.jsx`, `About/index.jsx`, `Contact/index.jsx`**: The landing page sections.
* **Admin Pages (`Frontend/src/pages/Admin`)**:
  * `Dashboard/index.jsx`: Admin dashboard widgets and charts.
  * `MasterData/`: `DataPegawai/index.jsx` (Employee data), `DataJabatan/index.jsx` (Position data). Translate table headers ("Nama Pegawai", "Jabatan", "Aksi") and button text ("Tambah Data").
  * `Transaksi/`: `DataKehadiran/index.jsx` (Attendance), `DataGaji/index.jsx` (Salary), `DataPotongan/index.jsx` (Deductions).
  * `Laporan/`: `LaporanAbsensi/index.jsx`, `LaporanGaji/index.jsx`, `SlipGaji/index.jsx` (Reports and Payslips).
  * `PengaturanAdmin/UbahPasswordAdmin/index.jsx`: Change password form.
* **Employee Pages (`Frontend/src/pages/Pegawai`)**:
  * `Dashboard/index.jsx`: Employee dashboard text.
  * `DataGajiPegawai/index.jsx`: Salary view for the employee.
  * `PengaturanPegawai/UbahPasswordPegawai/index.jsx`: Employee change password form.

### Tips for translating without breaking logic:

1. **Only change the text between HTML/JSX tags**:
   * Change: `<h1>Sistem Penggajian Karyawan</h1>`
   * To: `<h1>Employee Payroll System</h1>`
2. **Only change string values in standard HTML attributes** (like `placeholder`, `title`, `alt`):
   * Change: `<input placeholder="Masukkan Nama" />`
   * To: `<input placeholder="Enter Name" />`
3. **DO NOT change**:
   * Variable names (`const dataPegawai = ...`)
   * Object keys used for data binding (e.g., in `item.nama_pegawai`, don't change `nama_pegawai`)
   * API endpoints or route paths (`/admin/data-pegawai`)
   * Redux action names or state properties.
   * SweetAlert icons/logic (though you can translate the `title` and `text` within `Swal.fire({ ... })`).
