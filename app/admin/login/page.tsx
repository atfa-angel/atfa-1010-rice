"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/admin";

const initialState: LoginState = { status: "idle" };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-10">
      <h1 className="text-center text-xl font-bold">後台登入</h1>
      <form action={formAction} className="space-y-4 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">
            後台密碼
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
        </div>

        {state.status === "error" && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-60"
        >
          {isPending ? "登入中..." : "登入"}
        </button>
      </form>
    </main>
  );
}
