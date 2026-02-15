"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";

type FilterType = "all" | "income" | "expense";

export default function TransactionList() {
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [fundFilter, setFundFilter] = useState<string>("all");

  const { data: funds } = useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      const { data } = await supabase.from("funds").select("id, name");
      return data ?? [];
    },
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", typeFilter, fundFilter],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select(
          `
          id,
          amount,
          entry_type,
          note,
          created_at,
          funds ( id, name )
        `,
        )
        .order("created_at", { ascending: false });

      if (typeFilter !== "all") {
        query = query.eq("entry_type", typeFilter);
      }

      if (fundFilter !== "all") {
        query = query.eq("fund_id", fundFilter);
      }

      const { data } = await query;
      return data ?? [];
    },
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Transactions</h2>

        <div className="flex flex-wrap gap-2">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type as FilterType)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                typeFilter === type
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}

          <select
            value={fundFilter}
            onChange={(e) => setFundFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
          >
            <option value="all">All Funds</option>
            {funds?.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="py-3">Fund</th>
              <th className="py-3 hidden md:table-cell">Note</th>
              <th className="py-3 hidden md:table-cell">Date</th>
              <th className="py-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {/* Loading Skeleton Rows */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="h-4 bg-gray-200 rounded w-16 ml-auto" />
                  </td>
                </tr>
              ))}

            {!isLoading && transactions?.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">
                  No transactions yet.
                </td>
              </tr>
            )}

            {!isLoading &&
              transactions?.map((tx) => {
                const isIncome = tx.entry_type === "income";

                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          isIncome
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownLeft size={14} />
                        )}
                      </div>
                      <span className="font-medium">
                        {Array.isArray(tx.funds)
                          ? tx.funds[0]?.name
                          : tx.funds?.name}
                      </span>
                    </td>

                    <td className="py-4 hidden md:table-cell text-gray-500">
                      {tx.note ?? "—"}
                    </td>

                    <td className="py-4 hidden md:table-cell text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>

                    <td
                      className={`py-4 text-right font-semibold ${
                        isIncome ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"} ৳{" "}
                      {Number(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
