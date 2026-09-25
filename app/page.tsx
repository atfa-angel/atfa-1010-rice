"use client";

import { useActionState, useState } from "react";
import { registerAction, type RegisterState } from "@/app/actions/register";
import {
  BOX_PRICE,
  BOX_WEIGHT_KG,
  PACKS_PER_BOX,
  PACK_PRICE,
  PACK_WEIGHT_KG,
  PICKUP_NOTE,
  computeAmount,
  formatAmount,
  formatQuantity,
} from "@/lib/pricing";
import { BANK_INFO } from "@/lib/bank";
import SiteHeader from "@/components/SiteHeader";

const initialState: RegisterState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

function toCount(value: string): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 0;
}

export default function HomePage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const [boxesText, setBoxesText] = useState("");
  const [packsText, setPacksText] = useState("");

  const boxes = toCount(boxesText);
  const packs = toCount(packsText);
  const total = computeAmount(boxes, packs);
  const hasQuantity = boxes + packs > 0;

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
          <h2 className="mb-3 border-l-4 border-brand pl-3 font-bold text-brand">義賣資訊與價格</h2>
          <div className="grid grid-cols-2 gap-3">
            <PriceCard title="單包" price={PACK_PRICE} unit="包" detail={`${PACK_WEIGHT_KG} 公斤`} />
            <PriceCard
              title="整箱"
              price={BOX_PRICE}
              unit="箱"
              detail={`${PACKS_PER_BOX} 包／${BOX_WEIGHT_KG} 公斤`}
            />
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            <li>可選擇單包購買，或整箱購買</li>
            <li>每箱體積 44 x 33 x 25 cm</li>
            <li>由澳洲各大僑團、僑領、台人慈善機構組織認購</li>
            <li className="font-medium text-brand">取貨方式：{PICKUP_NOTE}</li>
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

            <fieldset className="space-y-3 rounded-lg border border-brand-border bg-brand-soft p-4">
              <legend className="px-1 text-sm font-medium">認購數量（單包或整箱擇一）</legend>
              <QuantityField
                label={`單包購買（AU$${formatAmount(PACK_PRICE)}／包）`}
                name="packs"
                unit="包"
                value={packsText}
                onChange={(value) => {
                  setPacksText(value);
                  if (value !== "") setBoxesText("");
                }}
              />
              <div className="flex items-center gap-3 text-sm font-semibold text-brand">
                <span className="h-px flex-1 bg-brand-border" />
                or
                <span className="h-px flex-1 bg-brand-border" />
              </div>
              <QuantityField
                label={`整箱購買（AU$${formatAmount(BOX_PRICE)}／箱，每箱 ${PACKS_PER_BOX} 包）`}
                name="boxes"
                unit="箱"
                value={boxesText}
                onChange={(value) => {
                  setBoxesText(value);
                  if (value !== "") setPacksText("");
                }}
              />
              <div className="flex items-baseline justify-between border-t border-brand-border pt-3 text-sm">
                <span className="text-gray-600">
                  {hasQuantity ? `認購 ${formatQuantity(boxes, packs)}` : "尚未選擇數量"}
                </span>
                <span>
                  應付金額{" "}
                  <strong className="text-xl text-brand">AU${formatAmount(total)}</strong>
                </span>
              </div>
            </fieldset>

            <div className="space-y-1">
              <label htmlFor="note" className="block text-sm font-medium">
                備註（選填）
              </label>
              <textarea id="note" name="note" rows={3} className={inputClass} />
            </div>

            <p className="rounded-md bg-brand-soft px-3 py-2 text-xs text-brand">取貨方式：{PICKUP_NOTE}</p>

            {state.status === "error" && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
            )}

            <button
              type="submit"
              disabled={isPending || !hasQuantity}
              className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
            >
              {isPending ? "送出中..." : hasQuantity ? `送出登記（AU$${formatAmount(total)}）` : "請先輸入認購數量"}
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

function PriceCard({
  title,
  price,
  unit,
  detail,
}: {
  title: string;
  price: number;
  unit: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-brand-border bg-brand-soft p-3 text-center">
      <p className="text-xs text-gray-600">{title}（{detail}）</p>
      <p className="mt-1 text-2xl font-bold text-brand">AU${formatAmount(price)}</p>
      <p className="text-xs text-gray-600">每{unit}</p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input id={name} name={name} type={type} required={required} className={inputClass} />
    </div>
  );
}

function QuantityField({
  label,
  name,
  unit,
  value,
  onChange,
}: {
  label: string;
  name: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-xs font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={name}
          name={name}
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
        <span className="text-sm text-gray-600">{unit}</span>
      </div>
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
        <dt className="text-gray-600">認購數量</dt>
        <dd>{formatQuantity(state.boxes, state.packs)}</dd>
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

      <p className="rounded-md bg-white px-3 py-2 text-sm text-brand">取貨方式：{PICKUP_NOTE}</p>

      <p className="text-xs text-gray-600">
        {state.emailSent
          ? "以上資訊已同時寄送至您填寫的 Email，請留意信箱（含垃圾郵件夾）。"
          : "提醒：確認信目前寄送失敗或尚未啟用，請截圖或記下以上資訊。"}
      </p>
    </section>
  );
}
