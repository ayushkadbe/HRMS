import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../../../layout";
import { Breadcrumb, ButtonOne } from "../../../../components";
import { FaPlus } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { BiCheck, BiX, BiSearch } from "react-icons/bi";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../../../config/redux/action";

const DataLembur = () => {
  const [dataLembur, setDataLembur] = useState([]);
  const [filterNama, setFilterNama] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const { isError, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchDataLembur = async () => {
    try {
      const response = await axios.get("http://localhost:5000/data_lembur");
      setDataLembur(response.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.msg || "Gagal mengambil data lembur",
      });
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/data_lembur/${id}/approve`);
      await fetchDataLembur();
      Swal.fire({ icon: "success", title: "Berhasil", text: "Lembur di-approve", timer: 1200, showConfirmButton: false });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.msg || "Gagal approve lembur",
      });
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/data_lembur/${id}/reject`);
      await fetchDataLembur();
      Swal.fire({ icon: "success", title: "Berhasil", text: "Lembur di-reject", timer: 1200, showConfirmButton: false });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.msg || "Gagal reject lembur",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Hapus data lembur ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/data_lembur/${id}`);
      await fetchDataLembur();
      Swal.fire({ icon: "success", title: "Berhasil", text: "Data lembur dihapus", timer: 1200, showConfirmButton: false });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.msg || "Gagal menghapus lembur",
      });
    }
  };

  const filteredData = useMemo(() => {
    return dataLembur.filter((item) => {
      const matchNama =
        filterNama === "" ||
        item.nama_pegawai.toLowerCase().includes(filterNama.toLowerCase());
      const matchStatus =
        filterStatus === "" || item.status.toLowerCase() === filterStatus.toLowerCase();
      return matchNama && matchStatus;
    });
  }, [dataLembur, filterNama, filterStatus]);

  useEffect(() => {
    fetchDataLembur();
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
      <Breadcrumb pageName="Overtime Data" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-4 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 mt-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-3">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search employee name..."
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            />
            <span className="absolute left-2 py-3 text-xl">
              <BiSearch />
            </span>
          </div>

          <div className="w-full md:w-1/4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="w-full md:w-auto">
            <Link to="/data-lembur/form-data-lembur/add">
              <ButtonOne>
                <span>Enter Overtime</span>
                <span><FaPlus /></span>
              </ButtonOne>
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 mt-6">
        <div className="max-w-full overflow-x-auto py-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-3 px-4 font-medium text-black dark:text-white">No</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">NIK</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Employee Name</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Date</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white text-center">Hours</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Reason</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Status</th>
                <th className="py-3 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id} className="border-b border-[#eee] dark:border-strokedark">
                  <td className="py-4 px-4 text-black dark:text-white">{index + 1}</td>
                  <td className="py-4 px-4 text-black dark:text-white">{item.nik}</td>
                  <td className="py-4 px-4 text-black dark:text-white">{item.nama_pegawai}</td>
                  <td className="py-4 px-4 text-black dark:text-white">{item.tanggal_lembur}</td>
                  <td className="py-4 px-4 text-black dark:text-white text-center">{item.jam_lembur}</td>
                  <td className="py-4 px-4 text-black dark:text-white">{item.alasan}</td>
                  <td className="py-4 px-4 text-black dark:text-white capitalize">{item.status}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {item.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(item.id)} title="Approve">
                            <BiCheck className="text-xl text-success hover:text-black dark:hover:text-white" />
                          </button>
                          <button onClick={() => handleReject(item.id)} title="Reject">
                            <BiX className="text-xl text-danger hover:text-black dark:hover:text-white" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(item.id)} title="Delete">
                        <BsTrash3 className="text-xl text-danger hover:text-black dark:hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default DataLembur;
