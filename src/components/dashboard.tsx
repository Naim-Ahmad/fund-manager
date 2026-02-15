"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, MinusCircle, PlusCircle, Wallet } from "lucide-react";
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
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:opacity-90 transition"
        >
          <PlusCircle size={18} />
          <span className="hidden md:inline">Add Income</span>
        </button>

        <button
          onClick={() => setExpenseOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:opacity-90 transition"
        >
          <MinusCircle size={18} />
          <span className="hidden md:inline">Add Expense</span>
        </button>

        <button
          onClick={() => setTransferOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:opacity-90 transition"
        >
          <ArrowLeftRight size={18} />
          <span className="hidden md:inline">Transfer Funds</span>
        </button>

        <button
          onClick={() => setFundOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:opacity-90 transition"
        >
          <Wallet size={18} />
          <span className="hidden md:inline">Create Fund</span>
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
