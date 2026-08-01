"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-melony-gold/25 bg-melony-black px-4 py-3 text-melony-cream placeholder:text-melony-cream/30 focus:border-melony-gold focus:outline-none";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className={inputClass}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className={inputClass}
      />
      {state.status === "error" && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-melony-gold px-6 py-3 font-medium text-melony-black transition-colors hover:bg-melony-gold-light disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
