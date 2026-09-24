import { prisma } from "@/lib/prisma";
import { formatAmount } from "@/lib/pricing";
import { formatReference } from "@/lib/reference";
import { logoutAction } from "@/app/actions/admin";
import PaidToggleButton from "./PaidToggleButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalBoxes = registrations.reduce((sum, r) => sum + r.boxes, 0);
  const totalAmount = registrations.reduce((sum, r) => sum + Number(r.amount), 0);
  const paidAmount = registrations
    .filter((r) => r.paid)
    .reduce((sum, r) => sum + Number(r.amount), 0);
  const unpaidAmount = totalAmount - paidAmount;
  const paidCount = registrations.filter((r) => r.paid).length;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">義賣登記後台</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            登出
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <SummaryCard label="登記筆數" value={String(registrations.length)} />
        <SummaryCard label="總箱數" value={`${totalBoxes} 箱`} />
        <SummaryCard label="應收總額" value={`AU$${formatAmount(totalAmount)}`} />
        <SummaryCard label={`已收款 (${paidCount})`} value={`AU$${formatAmount(paidAmount)}`} accent="green" />
        <SummaryCard label="未收款" value={`AU$${formatAmount(unpaidAmount)}`} accent="red" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th className="px-3 py-2">編號</th>
              <th className="px-3 py-2">登記時間</th>
              <th className="px-3 py-2">單位 / 姓名</th>
              <th className="px-3 py-2">聯絡人</th>
              <th className="px-3 py-2">電話</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2 text-right">箱數</th>
              <th className="px-3 py-2 text-right">金額</th>
              <th className="px-3 py-2">確認信</th>
              <th className="px-3 py-2">備註</th>
              <th className="px-3 py-2">收款狀態</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs">{formatReference(r.id)}</td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-500">
                  {r.createdAt.toLocaleString("zh-TW", { timeZone: "Australia/Sydney" })}
                </td>
                <td className="px-3 py-2">{r.orgName}</td>
                <td className="px-3 py-2">{r.contactName}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.phone}</td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2 text-right">{r.boxes}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                  AU${formatAmount(Number(r.amount))}
                </td>
                <td className="px-3 py-2 text-xs">
                  {r.emailSent ? (
                    <span className="text-green-700 dark:text-green-400">已寄送</span>
                  ) : (
                    <span className="text-gray-400">未寄送</span>
                  )}
                </td>
                <td className="max-w-[160px] truncate px-3 py-2 text-xs text-gray-500" title={r.note ?? undefined}>
                  {r.note ?? "-"}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <PaidToggleButton id={r.id} paid={r.paid} />
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-8 text-center text-gray-400">
                  目前尚無登記資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "green" | "red";
}) {
  const accentClass =
    accent === "green"
      ? "text-green-700 dark:text-green-400"
      : accent === "red"
        ? "text-red-700 dark:text-red-400"
        : "text-gray-900 dark:text-gray-100";

  return (
    <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${accentClass}`}>{value}</p>
    </div>
  );
}
