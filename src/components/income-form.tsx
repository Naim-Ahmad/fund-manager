"use client";

import { allocateIncome } from "@/lib/calculations";
import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive(),
});

type FormData = z.infer<typeof schema>;

export default function IncomeForm() {
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
    if (!funds || funds.length === 0) {
      alert("Create funds first");
      return;
    }

    const totalAllocation = funds.reduce(
      (sum, fund) => sum + Number(fund.allocation_pct),
      0,
    );

    if (totalAllocation !== 100) {
      alert("Total allocation must equal 100%");
      return;
    }

    const user = await supabase.auth.getUser();

    const splits = allocateIncome(values.amount, funds);

    for (const split of splits) {
      const fund = funds.find((f) => f.id === split.fund_id);

      await supabase
        .from("funds")
        .update({
          balance: Number(fund?.balance) + split.amount,
        })
        .eq("id", split.fund_id);

      await supabase.from("transactions").insert({
        user_id: user.data.user?.id,
        fund_id: split.fund_id,
        amount: split.amount,
        entry_type: "income",
      });
    }

    queryClient.invalidateQueries({ queryKey: ["funds"] });
    reset();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Add Income</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          placeholder="Income Amount"
          className="w-full border p-3 rounded-xl"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">Enter valid amount</p>
        )}

        <button className="w-full bg-black text-white py-3 rounded-xl">
          Distribute Income
        </button>
      </form>
    </div>
  );
}
