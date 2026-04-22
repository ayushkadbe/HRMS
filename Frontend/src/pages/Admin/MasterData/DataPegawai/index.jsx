import { useState, useEffect } from 'react';
import Layout from '../../../../layout';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { deleteDataPegawai, getDataPegawai, getMe } from '../../../../config/redux/action';
import { BiSearch } from 'react-icons/bi';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import axios from 'axios';

const ITEMS_PER_PAGE = 4;

const normalizeValue = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const DataPegawai = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isDownloadingCsv, setIsDownloadingCsv] = useState(false);
    const [mobileLayout, setMobileLayout] = useState('stacked');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);
    const isAdmin = user?.hak_akses === "admin";
    const { dataPegawai } = useSelector((state) => state.dataPegawai);

    const totalPages = Math.ceil(dataPegawai.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const filteredDataPegawai = dataPegawai.filter((pegawai) => {
        const { nama_pegawai, status } = pegawai;
        const keyword = searchKeyword.toLowerCase();
        const statusKeyword = filterStatus.toLowerCase();
        return (
            nama_pegawai.toLowerCase().includes(keyword) &&
            (filterStatus === '' || status.toLowerCase() === statusKeyword)
        );
    });

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleSearch = (event) => {
        setSearchKeyword(event.target.value);
    };

    const handleFilterStatus = (event) => {
        setFilterStatus(event.target.value);
    };

    const csvEscape = (value) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (/[",\r\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
        return str;
    };

    const onDownloadCsv = async () => {
        if (isDownloadingCsv) return;
        setIsDownloadingCsv(true);

        try {
            let jabatanByName = new Map();

            try {
                const jabatanResponse = await axios.get("http://localhost:5000/data_jabatan");
                const jabatanRows = Array.isArray(jabatanResponse.data) ? jabatanResponse.data : [];
                jabatanByName = new Map(
                    jabatanRows
                        .filter((j) => j && typeof j.nama_jabatan === "string")
                        .map((j) => [j.nama_jabatan, j])
                );
            } catch (err) {
                // If the user doesn't have access or the endpoint errors, export without salary values.
                console.warn("CSV export: failed to load data_jabatan:", err);
            }

            const header = ["Employee Name", "Position", "Salary"];
            const lines = [
                header.map(csvEscape).join(","),
                ...filteredDataPegawai.map((p) => {
                    const department = p?.jabatan || "";
                    const jabatan = jabatanByName.get(department);
                    const salary = jabatan?.gaji_pokok ?? "";

                    return [
                        p?.nama_pegawai || "",
                        department,
                        salary,
                    ].map(csvEscape).join(",");
                }),
            ];

            // UTF-8 BOM helps Excel open UTF-8 CSV correctly.
            const csv = "\ufeff" + lines.join("\r\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

            const datePart = new Date().toISOString().slice(0, 10);
            const fileName = `employee-list-${datePart}.csv`;

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Failed to download CSV. Please try again.",
            });
        } finally {
            setIsDownloadingCsv(false);
        }
    };

    const onDeletePegawai = (id) => {
        Swal.fire({
            title: 'Confirmation',
            text: 'Are you sure you want to delete this employee?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteDataPegawai(id)).then(() => {
                    Swal.fire({
                        title: 'Success',
                        text: 'Employee record deleted successfully.',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    dispatch(getDataPegawai());
                });
            }
        });
    };

    useEffect(() => {
        dispatch(getDataPegawai(startIndex, endIndex));
    }, [dispatch, startIndex, endIndex]);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/login');
        }
        if (
            user &&
            user.hak_akses !== 'admin' &&
            user.hak_akses !== 'site_admin' &&
            user.hak_akses !== 'site_manager'
        ) {
            navigate('/dashboard');
        }
    }, [isError, user, navigate]);

    const paginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`py-2 px-4 border border-gray-2 text-black font-semibold dark:text-white dark:border-strokedark ${currentPage === page ? 'bg-primary text-white hover:bg-primary dark:bg-primary dark:hover:bg-primary' : 'hover:bg-gray-2 dark:hover:bg-stroke'
                        } rounded-lg`}
                >
                    {page}
                </button>
            );
        }

        if (startPage > 2) {
            items.unshift(
                <p
                    key="start-ellipsis"
                    className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white"
                >
                    ...
                </p>
            );
        }

        if (endPage < totalPages - 1) {
            items.push(
                <p
                    key="end-ellipsis"
                    className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white"
                >
                    ...
                </p>
            );
        }

        return items;
    };

    return (
        <Layout>
            <Breadcrumb pageName="Employee Data" />
            <div className="flex flex-col sm:flex-row gap-3 items-start">
                <button
                    type="button"
                    onClick={onDownloadCsv}
                    disabled={isDownloadingCsv}
                    className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
                >
                    {isDownloadingCsv ? "Preparing..." : "Download CSV"}
                </button>

                {isAdmin && (
                    <Link to="/data-pegawai/form-data-pegawai/add">
                        <ButtonOne>
                            <span>Add Employee</span>
                            <span>
                                <FaPlus />
                            </span>
                        </ButtonOne>
                    </Link>
                )}
            </div>
            <div className="rounded-sm border border-stroke bg-white px-4 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:mr-2 md:max-w-xs">
                        <div className="relative">
                            <span className="absolute top-1/2 right-3 z-30 -translate-y-1/2 text-xl">
                                <MdOutlineKeyboardArrowDown />
                            </span>
                            <select
                                value={filterStatus}
                                onChange={handleFilterStatus}
                                className="relative w-full appearance-none rounded border border-stroke bg-transparent py-3 pl-4 pr-10 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            >
                                <option value="">Status</option>
                                <option value="Karyawan Tetap">Permanent Employee</option>
                                <option value="Karyawan Tidak Tetap">Temporary Employee</option>
                            </select>
                        </div>
                    </div>
                    <div className="relative w-full md:max-w-sm">
                        <input
                            type="text"
                            placeholder="Search employee name..."
                            value={searchKeyword}
                            onChange={handleSearch}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 pr-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <span className="absolute left-2 py-3 text-xl">
                            <BiSearch />
                        </span>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3 md:hidden">
                    <p className="text-sm text-gray-5 dark:text-gray-4">Mobile layout</p>
                    <div className="inline-flex rounded-lg border border-stroke p-1 dark:border-strokedark">
                        <button
                            type="button"
                            onClick={() => setMobileLayout('stacked')}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${mobileLayout === 'stacked'
                                ? 'bg-primary text-white'
                                : 'text-black dark:text-white'
                                }`}
                        >
                            Stacked
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileLayout('horizontal')}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${mobileLayout === 'horizontal'
                                ? 'bg-primary text-white'
                                : 'text-black dark:text-white'
                                }`}
                        >
                            Horizontal
                        </button>
                    </div>
                </div>

                <div className={`${mobileLayout === 'horizontal' ? 'block' : 'hidden'} md:block w-full overflow-x-scroll overscroll-x-contain py-4 [WebkitOverflowScrolling:touch]`}>
                    <table className="min-w-[1100px] table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">No</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Photo</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">NIK</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Employee Name</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Gender</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Position</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Join Date</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Access Role</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDataPegawai.slice(startIndex, endIndex).map((data, index) => {
                                const genderValue = normalizeValue(data.jenis_kelamin);
                                const statusValue = normalizeValue(data.status);
                                const accessRoleValue = normalizeValue(data.hak_akses);

                                return (
                                    <tr key={data.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="whitespace-nowrap text-center text-black dark:text-white">{startIndex + index + 1}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                                            <div className="h-12.5 w-15">
                                                <div className="rounded-full overflow-hidden">
                                                    <img src={`http://localhost:5000/images/${data.photo}`} alt="Profile Photo" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="whitespace-nowrap text-center text-black dark:text-white">{data.nik}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="whitespace-nowrap text-black dark:text-white">{data.nama_pegawai}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{genderValue === 'laki-laki' ? 'Male' : genderValue === 'perempuan' ? 'Female' : (data.jenis_kelamin || '-')}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{data.jabatan || "-"}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="whitespace-nowrap text-black dark:text-white">{data.tanggal_masuk}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="whitespace-nowrap text-black dark:text-white">{statusValue === 'karyawan tetap' ? 'Permanent Employee' : statusValue === 'karyawan tidak tetap' ? 'Temporary Employee' : (data.status || '-')}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="whitespace-nowrap text-black dark:text-white">{accessRoleValue === 'pegawai' ? 'Employee' : accessRoleValue === 'site_admin' ? 'Site Admin' : accessRoleValue === 'site_manager' ? 'Site Manager' : (data.hak_akses || '-')}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            {isAdmin && (
                                                <div className="flex items-center space-x-3.5 whitespace-nowrap">
                                                    <Link
                                                        to={`/data-pegawai/form-data-pegawai/edit/${data.id}`}
                                                        className="hover:text-black">
                                                        <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                                    </Link>
                                                    <button
                                                        onClick={() => onDeletePegawai(data.id)}
                                                        className="hover:text-black">
                                                        <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className={`${mobileLayout === 'stacked' ? 'grid' : 'hidden'} gap-4 py-4 md:hidden`}>
                    {filteredDataPegawai.slice(startIndex, endIndex).map((data, index) => {
                        const genderValue = normalizeValue(data.jenis_kelamin);
                        const statusValue = normalizeValue(data.status);
                        const accessRoleValue = normalizeValue(data.hak_akses);

                        return (
                            <div
                                key={data.id}
                                className="rounded-lg border border-stroke bg-transparent p-4 dark:border-strokedark"
                            >
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-5 dark:text-gray-4">
                                            Employee
                                        </p>
                                        <p className="text-base font-semibold text-black dark:text-white">
                                            {data.nama_pegawai}
                                        </p>
                                    </div>
                                    <p className="rounded-md bg-gray-2 px-2 py-1 text-xs font-medium text-black dark:bg-meta-4 dark:text-white">
                                        #{startIndex + index + 1}
                                    </p>
                                </div>

                                <div className="mb-4 flex items-center gap-3">
                                    <div className="h-14 w-14 overflow-hidden rounded-full">
                                        <img src={`http://localhost:5000/images/${data.photo}`} alt="Profile Photo" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-5 dark:text-gray-4">NIK</p>
                                        <p className="text-sm font-medium text-black dark:text-white">{data.nik}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-5 dark:text-gray-4">Gender</p>
                                        <p className="text-sm text-black dark:text-white">{genderValue === 'laki-laki' ? 'Male' : genderValue === 'perempuan' ? 'Female' : (data.jenis_kelamin || '-')}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-5 dark:text-gray-4">Position</p>
                                        <p className="text-sm text-black dark:text-white">{data.jabatan || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-5 dark:text-gray-4">Join Date</p>
                                        <p className="text-sm text-black dark:text-white">{data.tanggal_masuk}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-5 dark:text-gray-4">Status</p>
                                        <p className="text-sm text-black dark:text-white">{statusValue === 'karyawan tetap' ? 'Permanent Employee' : statusValue === 'karyawan tidak tetap' ? 'Temporary Employee' : (data.status || '-')}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-5 dark:text-gray-4">Access Role</p>
                                        <p className="text-sm text-black dark:text-white">{accessRoleValue === 'pegawai' ? 'Employee' : accessRoleValue === 'site_admin' ? 'Site Admin' : accessRoleValue === 'site_manager' ? 'Site Manager' : (data.hak_akses || '-')}</p>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <div className="mt-4 flex items-center gap-4 border-t border-stroke pt-4 dark:border-strokedark">
                                        <Link
                                            to={`/data-pegawai/form-data-pegawai/edit/${data.id}`}
                                            className="inline-flex items-center gap-2 text-primary"
                                        >
                                            <FaRegEdit className="text-xl" />
                                            <span className="text-sm font-medium">Edit</span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => onDeletePegawai(data.id)}
                                            className="inline-flex items-center gap-2 text-danger"
                                        >
                                            <BsTrash3 className="text-xl" />
                                            <span className="text-sm font-medium">Delete</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredDataPegawai.length)} of {filteredDataPegawai.length} employee records
                        </span>
                    </div>
                    <div className="flex space-x-2 py-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={goToPrevPage}
                            className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
                        >
                            < MdKeyboardDoubleArrowLeft />
                        </button>
                        {paginationItems()}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={goToNextPage}
                            className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
                        >
                            < MdKeyboardDoubleArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DataPegawai;
