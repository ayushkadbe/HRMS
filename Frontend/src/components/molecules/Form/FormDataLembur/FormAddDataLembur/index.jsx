import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import Layout from "../../../../../layout";
import { Breadcrumb, ButtonOne, ButtonTwo } from "../../../../../components";
import { getMe } from "../../../../../config/redux/action";

const FormAddDataLembur = () => {
  const [pegawaiId, setPegawaiId] = useState("");
  const [tanggalLembur, setTanggalLembur] = useState("");
  const [jamLembur, setJamLembur] = useState("");
  const [alasan, setAlasan] = useState("");
  const [errors, setErrors] = useState({});
  const [dataPegawai, setDataPegawai] = useState([]);

  const { isError, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tanggalRange = useMemo(() => {
    const today = new Date();
    const maxDate = today.toISOString().split("T")[0];
    const minDateObj = new Date(today);
    minDateObj.setDate(minDateObj.getDate() - 7);
    const minDate = minDateObj.toISOString().split("T")[0];
    return { minDate, maxDate };
  }, []);

  const validateForm = () => {
    const nextErrors = {};

    if (!pegawaiId) nextErrors.pegawaiId = "Pilih pegawai";
    if (!tanggalLembur) {
      nextErrors.tanggalLembur = "Tanggal lembur wajib diisi";
    } else {
      if (tanggalLembur > tanggalRange.maxDate) {
        nextErrors.tanggalLembur = "Tanggal lembur tidak boleh di masa depan";
      }
      if (tanggalLembur < tanggalRange.minDate) {
        nextErrors.tanggalLembur = "Tanggal lembur tidak boleh lebih dari 7 hari ke belakang";
      }
    }

    const jamLemburNum = Number(jamLembur);
    if (!jamLembur) {
      nextErrors.jamLembur = "Jam lembur wajib diisi";
    } else if (!Number.isInteger(jamLemburNum) || jamLemburNum < 1 || jamLemburNum > 6) {
      nextErrors.jamLembur = "Jam lembur harus antara 1 sampai 6";
    }

    if (!alasan || alasan.trim().length === 0) {
      nextErrors.alasan = "Alasan lembur wajib diisi";
    } else if (alasan.trim().length < 10) {
      nextErrors.alasan = "Alasan lembur minimal 10 karakter";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveDataLembur = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:5000/data_lembur", {
        pegawai_id: Number(pegawaiId),
        tanggal_lembur: tanggalLembur,
        jam_lembur: Number(jamLembur),
        alasan: alasan.trim(),
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data lembur berhasil disimpan",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/data-lembur");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.msg || "Gagal menyimpan data lembur",
      });
    }
  };

  const getDataPegawai = async () => {
    try {
      const response = await axios.get("http://localhost:5000/data_pegawai");
      setDataPegawai(response.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data pegawai",
      });
    }
  };

  useEffect(() => {
    getDataPegawai();
  }, []);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
    if (user && user.hak_akses !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  return (
    <Layout>
      <Breadcrumb pageName="Form Overtime Entry" />

      <div className="sm:grid-cols-2 mt-6">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Form Overtime Entry</h3>
            </div>
            <form onSubmit={saveDataLembur}>
              <div className="p-6.5">
                <div className="mb-5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Employee <span className="text-meta-1">*</span>
                  </label>
                  <select
                    value={pegawaiId}
                    onChange={(e) => setPegawaiId(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="">Select employee</option>
                    {dataPegawai.map((pegawai) => (
                      <option key={pegawai.id} value={pegawai.id}>
                        {pegawai.nama_pegawai} - {pegawai.nik}
                      </option>
                    ))}
                  </select>
                  {errors.pegawaiId && <p className="text-danger mt-1">{errors.pegawaiId}</p>}
                </div>

                <div className="mb-5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Date <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalLembur}
                    min={tanggalRange.minDate}
                    max={tanggalRange.maxDate}
                    onChange={(e) => setTanggalLembur(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                  />
                  {errors.tanggalLembur && <p className="text-danger mt-1">{errors.tanggalLembur}</p>}
                </div>

                <div className="mb-5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Overtime Hours <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={jamLembur}
                    onChange={(e) => setJamLembur(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    placeholder="1 - 6"
                  />
                  {errors.jamLembur && <p className="text-danger mt-1">{errors.jamLembur}</p>}
                </div>

                <div className="mb-5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Reason <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    rows="4"
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    placeholder="Masukkan alasan lembur (minimal 10 karakter)"
                  />
                  {errors.alasan && <p className="text-danger mt-1">{errors.alasan}</p>}
                </div>

                <div className="flex flex-col md:flex-row w-full gap-3 text-center">
                  <div>
                    <ButtonOne type="submit">
                      <span>Simpan</span>
                    </ButtonOne>
                  </div>
                  <Link to="/data-lembur">
                    <ButtonTwo>
                      <span>Kembali</span>
                    </ButtonTwo>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormAddDataLembur;
