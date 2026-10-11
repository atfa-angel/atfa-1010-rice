"use client";

import { useTransition } from "react";
import { setRegistrationOpenAction } from "@/app/actions/admin";

export default function RegistrationToggleButton({ open }: { open: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-3">
      <div>
        <p className="text-xs text-gray-500">登記狀態</p>
        <p className={`mt-1 text-lg font-semibold ${open ? "text-brand" : "text-amber-700"}`}>
          {open ? "開放中" : "已額滿（暫停登記）"}
        </p>
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => setRegistrationOpenAction(!open))}
        className={
          open
            ? "ml-auto rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
            : "ml-auto rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        }
      >
        {isPending ? "更新中..." : open ? "設為額滿，停止登記" : "重新開放登記"}
      </button>
    </div>
  );
}
