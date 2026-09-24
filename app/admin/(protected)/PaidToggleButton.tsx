"use client";

import { useTransition } from "react";
import { togglePaidAction } from "@/app/actions/admin";

export default function PaidToggleButton({ id, paid }: { id: number; paid: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => togglePaidAction(id, !paid))}
      className={
        paid
          ? "rounded-md border border-brand-border bg-brand-soft px-3 py-1 text-xs font-semibold text-brand transition hover:bg-white disabled:opacity-60"
          : "rounded-md bg-brand px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      }
    >
      {isPending ? "更新中..." : paid ? "已收款 ✓（點擊取消）" : "標記已收款"}
    </button>
  );
}
