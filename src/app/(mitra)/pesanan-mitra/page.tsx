"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import useFetchBooking from "@/hooks/useFetchBooking";
import Swal from "sweetalert2";
import TableBookingOwner from "@/components/BookingOwner/TableBookingOwner";
import Booking from "@/types/Booking";

const PesananAdmin = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);
  const [currentModalId, setCurrentModalId] = useState("");
  const [dataBooking, setDataBooking] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filteredData, setFilteredData] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [detailBooking, setDetailBooking] = useState<any>();

  const {
    handleUpdateBooking,
    handleGetBookingById,
    handleGetBookingByOwner,
    handleDeleteBooking,
  } = useFetchBooking();

  useEffect(() => {
    const fetchData = async () => {
      let query = `limit=2&page=${currentPage}`;

      const data = await handleGetBookingByOwner(query);
      console.log(data, "DATA");
      if (data && data.data) {
        let filteredData = data.data.filter((item: Booking) => {
          const matchesSearch =
            // item.user.nama.toLowerCase().includes(search.toLowerCase()) ||
            item.catatan.toLowerCase().includes(search.toLowerCase()) ||
            item.villa.nama.toLowerCase().includes(search.toLowerCase());

          const matchesStatus =
            selectedStatus === "All" || item.status === selectedStatus;

          return matchesSearch && matchesStatus; // Gabungkan filter search dan status
        });

        setDataBooking(filteredData);
        setPagination(data.pagination);
      } else {
        setDataBooking([]);
        setPagination(null);
      }
    };

    fetchData();
  }, [currentPage, search, selectedStatus]);

  useEffect(() => {
    if (currentModalId) {
      const fetchData = async () => {
        const data = await handleGetBookingById(currentModalId);
        if (data) {
          setDetailBooking(data.data);
        }
      };

      fetchData();
    }
  }, [currentModalId]);

  useEffect(() => {
    if (selectedStatus === "All") {
      setFilteredData(dataBooking);
    } else {
      setFilteredData(
        dataBooking.filter((item) => item.status === selectedStatus)
      );
    }
  }, [selectedStatus, dataBooking]);

  const toggleModal = (id: any) => {
    setCurrentModalId(id);
    setIsModalOpen(!isModalOpen);
  };

  const toggleModalEdit = (id: any) => {
    setCurrentModalId(id);
    setIsModalEditOpen(!isModalEditOpen);
  };

  const handleSubmit = (id: string, updatedBooking: any) => {
    handleUpdateBooking(id, updatedBooking);
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Pembayaran berhasil diubah",
    });
    setFilteredData((prevData) =>
      prevData.map((item) => (item._id === id ? updatedBooking : item))
    );
    toggleModalEdit(null);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteBooking(id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        Swal.fire("Cancelled", "Your file is safe :)", "error");
      }
    });

    setFilteredData((prevData) => prevData.filter((item) => item._id !== id));
  };

  const handleCurrentPage = (currentPage: number) => {
    setCurrentPage(currentPage);
  };

  const handleSearch = (keyword: string) => {
    setSearch(keyword);
  };

  const handleSelectStatus = (selectedStatus: string) => {
    setSelectedStatus(selectedStatus);
  };
  return (
    <div>
      <div className="bg-white p-4 shadow-md rounded-md mb-4 mx-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex space-x-2 text-sm font-medium">
            <li>
              <a
                href="/dashboardAdmin"
                className="text-gray-500 hover:text-gray-700"
              >
                Dashboard
              </a>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <a
                href="/pesanan-admin"
                className="text-gray-500 hover:text-gray-700"
              >
                Transaksi
              </a>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <span className="text-gray-500"></span>
              Pesanan
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex justify-between border-2 shadow-lg rounded-md items-center mb-3 bg-white p-6 m-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Manajemen Pesanan</h1>
          <p>Description</p>
        </div>
        <div>
          <button
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-7 mr-10"
          >
            <p>+ Tambah Pesanan</p>
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <h2 className="text-xl font-bold mb-6">Pesanan</h2>
          <div className="border-b-2 border-gray-200 w-full md:w-[600px]"></div>
          <div className="mt-5">
            <TableBookingOwner
              filteredData={filteredData}
              search={search}
              selectedStatus={selectedStatus}
              pagination={pagination}
              handleCurrentPage={handleCurrentPage}
              handleSearch={handleSearch}
              toggleModal={toggleModal}
              handleSelectStatus={handleSelectStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PesananAdmin;
