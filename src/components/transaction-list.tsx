"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
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

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (transactions?.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center text-gray-400">
        No transactions yet.
        <div className="mt-2 text-sm">
          Add income or expense to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 p-4 hover:bg-gray-50 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Transactions</h2>

        <div className="flex gap-2">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type as FilterType)}
              className={`px-4 py-2 rounded-xl text-sm ${
                typeFilter === type ? "bg-black text-white" : "bg-gray-100"
              }`}
            >
              {type}
            </button>
          ))}
          <select
            value={fundFilter}
            onChange={(e) => setFundFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200"
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

      <div className="space-y-4">
        {transactions?.length === 0 && (
          <p className="text-gray-500">No transactions yet</p>
        )}

        {transactions?.map((tx) => (
          <div
            key={tx.id}
            className="flex justify-between items-center border-b pb-3"
          >
            <div>
              <p className="font-medium">{tx.funds?.name}</p>
              <p className="text-sm text-gray-500">{tx.note ?? "—"}</p>
              <p className="text-xs text-gray-400">
                {new Date(tx.created_at).toLocaleString()}
              </p>
            </div>

            <p
              className={`font-semibold ${
                tx.entry_type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {tx.entry_type === "income" ? "+" : "-"} ৳{" "}
              {Number(tx.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
