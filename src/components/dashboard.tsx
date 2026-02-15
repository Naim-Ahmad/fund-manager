"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ExpenseForm from "./expense-form";
import FundCard from "./fund-card";
import FundForm from "./fund-form";
import IncomeForm from "./income-form";
import TransferForm from "./transfer-form";
import Modal from "./ui/modal";

export default function Dashboard() {
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);

  const { data: funds } = useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      const { data } = await supabase.from("funds").select("*");
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setIncomeOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-xl"
        >
          Add Income
        </button>

        <button
          onClick={() => setExpenseOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-xl"
        >
          Add Expense
        </button>

        <button
          onClick={() => setTransferOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Transfer Funds
        </button>

        <button
          onClick={() => setFundOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-xl"
        >
          Create Fund
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {funds?.map((fund) => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </div>

      <Modal
        open={incomeOpen}
        onClose={() => setIncomeOpen(false)}
        title="Add Income"
      >
        <IncomeForm />
      </Modal>

      <Modal
        open={expenseOpen}
        onClose={() => setExpenseOpen(false)}
        title="Add Expense"
      >
        <ExpenseForm />
      </Modal>

      <Modal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title="Transfer Between Funds"
      >
        <TransferForm />
      </Modal>

      <Modal
        open={fundOpen}
        onClose={() => setFundOpen(false)}
        title="Create Fund"
      >
        <FundForm />
      </Modal>
    </div>
  );
}
