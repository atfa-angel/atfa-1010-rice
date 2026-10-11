import { BOX_PRICE, BOX_WEIGHT_KG, PACKS_PER_BOX, PACK_PRICE, PACK_WEIGHT_KG, PICKUP_NOTE, SHIPPING_NOTE, formatAmount } from "@/lib/pricing";
import { CONTACT_EMAIL } from "@/lib/contact";
import { isRegistrationOpen } from "@/lib/registration";
import SiteHeader from "@/components/SiteHeader";
import RegistrationForm from "@/components/RegistrationForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const open = await isRegistrationOpen();

  return (
    <>
      <SiteHeader
        eyebrow="115年 澳洲雙十國慶"
        title={open ? "台灣優米義賣活動 登記" : "台灣優米義賣活動 登記已額滿"}
      />

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
            <li className="font-medium text-red-700">發貨日期：{SHIPPING_NOTE}</li>
            <li>
              聯繫詢問：
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand underline">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </section>

        {open ? <RegistrationForm /> : <SoldOutPanel />}
      </main>

      <footer className="bg-brand py-4 text-center text-xs text-brand-border">
        <p>澳洲臺灣同鄉會 Australian Taiwanese Friendship Association</p>
        <p className="mt-1">
          聯繫詢問：
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-white">
            {CONTACT_EMAIL}
          </a>
        </p>
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
      <p className="text-xs text-gray-600">
        {title}（{detail}）
      </p>
      <p className="mt-1 text-2xl font-bold text-brand">AU${formatAmount(price)}</p>
      <p className="text-xs text-gray-600">每{unit}</p>
    </div>
  );
}

function SoldOutPanel() {
  return (
    <section className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-center">
      <h2 className="text-lg font-bold text-amber-800">登記已額滿</h2>
      <p className="text-sm text-amber-900">
        感謝大家的熱烈響應！本次台灣優米義賣活動的名額已經額滿，目前暫停接受新的登記。
      </p>
      <p className="text-sm text-amber-900">
        如有任何問題，歡迎與我們聯繫：
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand underline">
          {CONTACT_EMAIL}
        </a>
      </p>
    </section>
  );
}
