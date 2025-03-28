"use client";

import {useQuery} from "@tanstack/react-query";
import {getVouchers} from "../utils/getVouchers";
import {IVoucher} from "../lib/models/voucher";
import {Copy} from "lucide-react";
import {useState} from "react";

const VoucherList = () => {
  const {
    data: vouchers,
    // error,
    // isFetching,
  } = useQuery<IVoucher[]>({
    queryKey: ["vouchers"],
    queryFn: getVouchers,
    initialData: [],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyClick = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {vouchers?.map((voucher) => (
        <div
          key={voucher._id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            {voucher.voucherName}
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            {voucher.discountType === "price" ? "Get " : "Get free delivery and "}
            {voucher.discountPercentage}% off
            {voucher.minOrderValue > 0 && ` for orders above Rp${voucher.minOrderValue.toLocaleString()}`}
          </p>
          <div className="bg-gray-100 rounded-md p-3 mb-3">
            <p className="text-sm text-gray-500 mb-1">Voucher Code</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-lg font-medium text-gray-800">
                {voucher.voucherCode}
              </p>
              <button
                onClick={() => handleCopyClick(voucher.voucherCode)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  copiedCode === voucher.voucherCode
                    ? "bg-green-100 text-green-600"
                    : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                }`}
                title="Copy voucher code"
                aria-label="Copy voucher code"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copiedCode === voucher.voucherCode && (
              <p className="text-sm text-green-600 mt-1">Copied!</p>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              Expires:{" "}
              {new Date(voucher.voucherExpiration).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoucherList;
