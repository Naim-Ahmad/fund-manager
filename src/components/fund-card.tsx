"use client";

import FundEditModal from "./fund-edit-modal";

export default function FundCard({ fund }: { fund: any }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{fund.name}</h3>

        <span
          className={`text-xs px-3 py-1 rounded-full ${
            fund.type === "locked"
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {fund.type}
        </span>
      </div>

      <p className="text-3xl font-bold tracking-tight">
        ৳ {Number(fund.balance).toLocaleString()}
      </p>

      <div className="mt-6 text-sm text-gray-500">
        Allocation: {fund.allocation_pct}%
      </div>

      <div className="mt-4">
        <FundEditModal fund={fund} />
      </div>
    </div>
  );
}
