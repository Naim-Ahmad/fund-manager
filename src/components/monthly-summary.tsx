"use client";

import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function MonthlySummary() {
  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select(`
          amount,
          entry_type,
          created_at,
          funds ( name )
        `);

      return data ?? [];
    },
  });

  const currentMonthData = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return (
      transactions?.filter((tx) => {
        const date = new Date(tx.created_at);
        return date.getMonth() === month && date.getFullYear() === year;
      }) ?? []
    );
  }, [transactions]);

  const incomeTotal = currentMonthData
    .filter((tx) => tx.entry_type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const expenseTotal = currentMonthData
    .filter((tx) => tx.entry_type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const expenseBreakdown = Object.values(
    currentMonthData
      .filter((tx) => tx.entry_type === "expense")
      .reduce((acc: any, tx) => {
        const name = tx.funds?.name ?? "Unknown";
        acc[name] = acc[name] || { name, value: 0 };
        acc[name].value += Number(tx.amount);
        return acc;
      }, {}),
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-semibold mb-6">Monthly Overview</h2>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Income</p>
          <p className="text-xl font-bold text-green-600">
            ৳ {incomeTotal.toLocaleString()}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Expense</p>
          <p className="text-xl font-bold text-red-600">
            ৳ {expenseTotal.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Net</p>
          <p className="text-xl font-bold text-blue-600">
            ৳ {(incomeTotal - expenseTotal).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense Breakdown Pie Chart */}
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseBreakdown}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              fill="#8884d8"
            >
              {expenseBreakdown.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Expense Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { name: "Income", value: incomeTotal },
              { name: "Expense", value: expenseTotal },
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
