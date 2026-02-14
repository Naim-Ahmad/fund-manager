"use client";

import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (mode === "register") {
      await supabase.auth.signUp(data);
    } else {
      await supabase.auth.signInWithPassword(data);
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border p-3 rounded-xl"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Invalid email</p>
          )}

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-xl"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">Min 6 characters</p>
          )}

          <button
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
