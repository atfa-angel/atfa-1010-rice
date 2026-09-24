"use client";

import { useActionState } from "react";
import { registerAction, type RegisterState } from "@/app/actions/register";
import { formatAmount } from "@/lib/pricing";
import { BANK_INFO } from "@/lib/bank";
import SiteHeader from "@/components/SiteHeader";

const initialState: RegisterState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function HomePage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <>
      <SiteHeader eyebrow="115年 澳洲雙十國慶" title="台灣優米義賣活動 登記" />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <section className="space-y-3 rounded-xl border border-brand-border bg-white p-5 text-sm leading-relaxed">
          <p>
            由台灣優米公司贊助，捐出近七噸的台灣出口頂級白米，結合全澳各大城市台商，於115年雙十國慶前夕舉辦白米義賣活動。所得將全數捐給各城市國慶慶祝活動承辦單位指定之慈善單位。
          </p>
          <p>雪梨地區由雪梨雙十國慶籌備會組織認購，澳洲台灣商會負責金流捐款。</p>
          <p>
            雪梨地區捐款對象為{" "}
            <strong className="text-brand">
              Thoracic Oncology Group Australasia（TOGA，澳洲胸腔腫瘤/肺癌研究機構）
            </strong>
            ，長期關注亞裔不吸菸女性肺腺癌高發生率，聚焦 EGFR 基因突變與精準標靶治療研究。總捐款金額將於 10 月 10
            日前彙整，於雪梨僑界國慶晚宴上邀請 TOGA 代表出席並進行捐贈儀式。
          </p>
        </section>

        <section className="rounded-xl border border-brand-border bg-white p-5">
          <h2 className="mb-3 border-l-4 border-brand pl-3 font-bold text-brand">義賣資訊</h2>
          <ul className="space-y-1 text-sm">
            <li>每包 1.5 公斤，一箱 12 包／18 公斤</li>
            <li>
              每包 AU$10.10 元，<span className="font-semibold text-brand">每箱 AU$121.20 元</span>
            </li>
            <li>每箱體積 44 x 33 x 25 cm</li>
            <li>由澳洲各大僑團、僑領、台人慈善機構組織認購</li>
          </ul>
        </section>

        {state.status === "success" ? (
          <ConfirmationPanel state={state} />
        ) : (
          <form action={formAction} className="space-y-4 rounded-xl border border-brand-border bg-white p-5">
            <h2 className="border-l-4 border-brand pl-3 font-bold text-brand">登記認購</h2>

            <Field label="認購單位 / 姓名" name="orgName" required />
            <Field label="聯絡人" name="contactName" required />
            <Field label="聯絡電話" name="phone" type="tel" required />
            <Field label="Email（用於接收匯款資訊）" name="email" type="email" required />
            <Field label="認購箱數" name="boxes" type="number" min={1} step={1} required />

            <div className="space-y-1">
              <label htmlFor="note" className="block text-sm font-medium">
                備註（選填）
              </label>
              <textarea id="note" name="note" rows={3} className={inputClass} />
            </div>

            {state.status === "error" && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {isPending ? "送出中..." : "送出登記"}
            </button>
          </form>
        )}
      </main>

      <footer className="bg-brand py-4 text-center text-xs text-brand-border">
        澳洲臺灣同鄉會 Australian Taiwanese Friendship Association
      </footer>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        step={step}
        className={inputClass}
      />
    </div>
  );
}

function ConfirmationPanel({
  state,
}: {
  state: Extract<RegisterState, { status: "success" }>;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-brand-border bg-brand-soft p-5">
      <h2 className="border-l-4 border-brand pl-3 font-bold text-brand">登記成功！請完成匯款</h2>

      <dl className="grid grid-cols-2 gap-y-2 text-sm">
        <dt className="text-gray-600">登記編號</dt>
        <dd className="font-mono font-semibold">{state.reference}</dd>
        <dt className="text-gray-600">認購箱數</dt>
        <dd>{state.boxes} 箱</dd>
        <dt className="text-gray-600">應付金額</dt>
        <dd className="font-semibold text-brand">AU${formatAmount(state.amount)}</dd>
      </dl>

      <div className="rounded-lg border border-brand-border bg-white p-4 text-sm">
        <p className="mb-2 font-bold text-brand">匯款帳戶資訊</p>
        <p>戶名 Account Name：{BANK_INFO.accountName}</p>
        <p>BSB：{BANK_INFO.bsb}</p>
        <p>帳號 Account Number：{BANK_INFO.accountNumber}</p>
        <p className="mt-2 font-medium text-red-700">
          請於轉帳備註欄位填寫登記編號「{state.reference}」，以利核對款項。
        </p>
      </div>

      <p className="text-xs text-gray-600">
        {state.emailSent
          ? "以上資訊已同時寄送至您填寫的 Email，請留意信箱（含垃圾郵件夾）。"
          : "提醒：確認信目前寄送失敗或尚未啟用，請截圖或記下以上資訊。"}
      </p>
    </section>
  );
}
