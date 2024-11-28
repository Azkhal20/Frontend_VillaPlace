import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Utils
import { formatDate } from "@/utils/formatDate";
import getPaymentImage from "@/utils/getPaymentImage";
import {
  getStatusPaymentColor,
  getStatusPaymentLabel,
} from "@/utils/getStatusLabelAndColor";

interface PaymentCardProps {
  item: any;
  toggleModal: (id: any) => void;
  countdown: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  item,
  toggleModal,
  countdown,
}) => {
  return (
    <div className="box-3 mb-4">
      <div className="flex justify-between text-sm mb-4 items-center ">
        <div className="inline-flex items-center ">
          <p>{formatDate(item.tanggal_pembayaran)}</p>
          <div className="border-r border-form-strokedark h-5 mx-2"></div>
          <p className="text-form-strokedark">
            <span className="text-sm">#{item.kode_pembayaran}</span>
          </p>
          <div className="border-r border-form-strokedark h-5 mx-2"></div>
          {item.status_pembayaran === "pending" && (
            <div className="text-md font-semibold">
              Bayar dalam:
              <span className="text-red-600 "> {countdown}</span>
            </div>
          )}
        </div>
        <p
          className={`inline-flex ${getStatusPaymentColor(
            item.status_pembayaran
          )} rounded-full bg-opacity-10 border py-1 px-3 text-xs font-bold mr-2 `}
        >
          {getStatusPaymentLabel(item.status_pembayaran)}
        </p>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex">
          <Image
            src={item.pesanan.villa.foto_villa[0].url}
            width={100}
            height={100}
            alt="product"
            className="rounded-lg mr-4"
          />
          <div>
            <p className="font-bold">{item.pesanan.villa.nama}</p>
            <div className="text-sm flex gap-2 text-form-strokedark mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 h-4 w-4 stroke-2 text-inherit"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <span> {item.pesanan.villa.lokasi}</span>
            </div>
          </div>
        </div>
        <div className="border-line px-5">
          <p className="text-form-strokedark mb-3">Pembayaran</p>
          <div className="font-bold text-slate-700 flex flex-col gap-2">
            <Image
              src={getPaymentImage(item.tipe_pembayaran)}
              width={60}
              height={60}
              alt="Pembayaran"
            />
            <p>{item.metode_pembayaran}</p>
          </div>
        </div>

        <div className="border-line px-10 justify-start">
          <p>Total Pembayaran</p>
          <p className="font-bold">
            Rp {item.jumlah_pembayaran.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
      <div className="flex justify-end items-center mt-7 gap-2">
        <button
          type="button"
          onClick={() => toggleModal(item._id)}
          className="flex justify-end font-semibold text-[#089562] bg-[#089562] bg-opacity-10 border border-[#089562] hover:bg-opacity-30 rounded text-sm px-3 py-1.5 me-2 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Lihat Detail
        </button>

        <Link href={`#`}>
          <button
            type="button"
            className="flex justify-end font-semibold text-white bg-[#089562] hover:bg-green-800 rounded text-sm px-3 py-1.5 me-2 dark:bg-green-600 dark:hover:bg-green-700"
          >
            Cara Pembayaran
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCard;