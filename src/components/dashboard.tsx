"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ExpenseForm from "./expense-form";
import FundCard from "./fund-card";
import IncomeForm from "./income-form";
import MonthlySummary from "./monthly-summary";
import TransactionList from "./transaction-list";
import TransferForm from "./transfer-form";

export default function Dashboard() {
  const { data: funds } = useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      const { data } = await supabase.from("funds").select("*");
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <IncomeForm />
        <ExpenseForm />
      </div>

      <TransferForm />

      <div className="grid md:grid-cols-3 gap-6">
        {funds?.map((fund) => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </div>

      <TransactionList />

      <MonthlySummary />
    </div>
  );
}
