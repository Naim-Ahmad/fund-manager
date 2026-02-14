"use client";

import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  fund_id: z.string(),
  amount: z.number().positive(),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ExpenseForm() {
  const queryClient = useQueryClient();

  const { data: funds } = useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      const { data } = await supabase.from("funds").select("*");
      return data ?? [];
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormData) => {
    const fund = funds?.find((f) => f.id === values.fund_id);

    if (!fund) {
      alert("Invalid fund selected");
      return;
    }

    if (Number(fund.balance) < values.amount) {
      alert("Insufficient balance");
      return;
    }

    if (fund.type === "locked") {
      const confirmUse = confirm(
        "This is a locked fund. Are you sure you want to spend from it?",
      );

      if (!confirmUse) return;
    }

    const user = await supabase.auth.getUser();

    await supabase
      .from("funds")
      .update({
        balance: Number(fund.balance) - values.amount,
      })
      .eq("id", values.fund_id);

    await supabase.from("transactions").insert({
      user_id: user.data.user?.id,
      fund_id: values.fund_id,
      amount: values.amount,
      entry_type: "expense",
      note: values.note ?? null,
    });

    queryClient.invalidateQueries({ queryKey: ["funds"] });
    reset();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select
          {...register("fund_id")}
          className="w-full border p-3 rounded-xl"
        >
          <option value="">Select Fund</option>
          {funds?.map((fund) => (
            <option key={fund.id} value={fund.id}>
              {fund.name} (৳ {Number(fund.balance).toLocaleString()})
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          placeholder="Expense Amount"
          className="w-full border p-3 rounded-xl"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">Enter valid amount</p>
        )}

        <input
          {...register("note")}
          placeholder="Note (optional)"
          className="w-full border p-3 rounded-xl"
        />

        <button className="w-full bg-red-600 text-white py-3 rounded-xl">
          Deduct Expense
        </button>
      </form>
    </div>
  );
}
