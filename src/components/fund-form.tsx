"use client";

import { validateAllocationTotal } from "@/lib/calculations";
import { supabase } from "@/lib/supabase/client";
import { fundSchema } from "@/lib/validations/fund.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof fundSchema>;

export default function FundForm() {
  const queryClient = useQueryClient();

  const { data: existingFunds } = useQuery({
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
    resolver: zodResolver(fundSchema),
  });

  const onSubmit = async (values: FormData) => {
    const updatedFunds = [...(existingFunds ?? []), values];

    console.log(updatedFunds);

    const { isValid } = validateAllocationTotal(updatedFunds);

    if (!isValid) {
      alert("Total allocation must equal 100%");
      return;
    }

    const user = await supabase.auth.getUser();

    await supabase.from("funds").insert({
      ...values,
      user_id: user.data.user?.id,
    });

    queryClient.invalidateQueries({ queryKey: ["funds"] });
    reset();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Create Fund</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          placeholder="Fund Name"
          className="w-full border p-3 rounded-xl"
        />
        {errors.name && <p className="text-red-500 text-sm">Required</p>}

        <select {...register("type")} className="w-full border p-3 rounded-xl">
          <option value="spendable">Spendable</option>
          <option value="locked">Locked</option>
        </select>

        <input
          type="number"
          {...register("allocation_pct", { valueAsNumber: true })}
          placeholder="Allocation %"
          className="w-full border p-3 rounded-xl"
        />
        {errors.allocation_pct && (
          <p className="text-red-500 text-sm">0–100 only</p>
        )}

        <button className="w-full bg-black text-white py-3 rounded-xl">
          Add Fund
        </button>
      </form>
    </div>
  );
}
