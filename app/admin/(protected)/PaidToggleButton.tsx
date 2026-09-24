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
          ? "rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          : "rounded-md bg-green-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
      }
    >
      {isPending ? "更新中..." : paid ? "取消收款標記" : "標記已收款"}
    </button>
  );
}
