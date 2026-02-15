"use client";

import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  from_fund_id: z.string(),
  to_fund_id: z.string(),
  amount: z.number().positive(),
});

type FormData = z.infer<typeof schema>;

export default function TransferForm() {
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
    if (values.from_fund_id === values.to_fund_id) {
      alert("Cannot transfer to same fund");
      return;
    }

    const fromFund = funds?.find((f) => f.id === values.from_fund_id);
    const toFund = funds?.find((f) => f.id === values.to_fund_id);

    if (!fromFund || !toFund) {
      alert("Invalid fund selection");
      return;
    }

    if (Number(fromFund.balance) < values.amount) {
      alert("Insufficient balance in source fund");
      return;
    }

    const user = await supabase.auth.getUser();

    // Update balances
    await supabase
      .from("funds")
      .update({
        balance: Number(fromFund.balance) - values.amount,
      })
      .eq("id", values.from_fund_id);

    await supabase
      .from("funds")
      .update({
        balance: Number(toFund.balance) + values.amount,
      })
      .eq("id", values.to_fund_id);

    // Insert transfer transactions
    await supabase.from("transactions").insert([
      {
        user_id: user.data.user?.id,
        fund_id: values.from_fund_id,
        amount: values.amount,
        entry_type: "transfer",
        note: `Transfer to ${toFund.name}`,
      },
      {
        user_id: user.data.user?.id,
        fund_id: values.to_fund_id,
        amount: values.amount,
        entry_type: "transfer",
        note: `Transfer from ${fromFund.name}`,
      },
    ]);

    queryClient.invalidateQueries({ queryKey: ["funds"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <select
        {...register("from_fund_id")}
        className="w-full border p-3 rounded-xl"
      >
        <option value="">From Fund</option>
        {funds?.map((fund) => (
          <option key={fund.id} value={fund.id}>
            {fund.name} (৳ {Number(fund.balance).toLocaleString()})
          </option>
        ))}
      </select>

      <select
        {...register("to_fund_id")}
        className="w-full border p-3 rounded-xl"
      >
        <option value="">To Fund</option>
        {funds?.map((fund) => (
          <option key={fund.id} value={fund.id}>
            {fund.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.01"
        {...register("amount", { valueAsNumber: true })}
        placeholder="Transfer Amount"
        className="w-full border p-3 rounded-xl"
      />

      {errors.amount && (
        <p className="text-red-500 text-sm">Enter valid amount</p>
      )}

      <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
        Transfer
      </button>
    </form>
  );
}
