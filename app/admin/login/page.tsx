"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/admin";
import SiteHeader from "@/components/SiteHeader";

const initialState: LoginState = { status: "idle" };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <>
      <SiteHeader title="義賣登記後台" />
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-10">
        <form action={formAction} className="space-y-4 rounded-xl border border-brand-border bg-white p-5">
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
              className="w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {state.status === "error" && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {isPending ? "登入中..." : "登入"}
          </button>
        </form>
      </main>
    </>
  );
}
