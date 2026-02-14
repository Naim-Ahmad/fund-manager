"use client";

import { validateAllocationTotal } from "@/lib/calculations";
import { supabase } from "@/lib/supabase/client";
import { fundSchema } from "@/lib/validations/fund.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof fundSchema>;

export default function FundEditModal({ fund }: { fund: any }) {
  const [open, setOpen] = useState(false);
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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(fundSchema),
    defaultValues: fund,
  });

  const onSubmit = async (values: FormData) => {
    const updatedFunds = funds?.map((f) =>
      f.id === fund.id ? { ...f, ...values } : f,
    );

    const { isValid } = validateAllocationTotal(updatedFunds ?? []);

    if (!isValid) {
      alert("Total allocation must equal 100%");
      return;
    }

    await supabase.from("funds").update(values).eq("id", fund.id);

    queryClient.invalidateQueries({ queryKey: ["funds"] });
    setOpen(false);
  };

  const handleDelete = async () => {
    if (Number(fund.balance) > 0) {
      const confirmDelete = confirm("This fund has balance. Delete anyway?");
      if (!confirmDelete) return;
    }

    await supabase.from("funds").delete().eq("id", fund.id);

    queryClient.invalidateQueries({ queryKey: ["funds"] });
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm text-blue-600">
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Fund</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("name")}
                className="w-full border p-3 rounded-xl"
              />

              <select
                {...register("type")}
                className="w-full border p-3 rounded-xl"
              >
                <option value="spendable">Spendable</option>
                <option value="locked">Locked</option>
              </select>

              <input
                type="number"
                {...register("allocation_pct", {
                  valueAsNumber: true,
                })}
                className="w-full border p-3 rounded-xl"
              />

              {errors.allocation_pct && (
                <p className="text-red-500 text-sm">0–100 only</p>
              )}

              <button className="w-full bg-black text-white py-3 rounded-xl">
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full bg-red-600 text-white py-3 rounded-xl"
              >
                Delete Fund
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
