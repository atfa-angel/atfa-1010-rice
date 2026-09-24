import { Resend } from "resend";
import { BANK_INFO } from "./bank";
import { formatAmount } from "./pricing";

type ConfirmationEmailParams = {
  to: string;
  contactName: string;
  orgName: string;
  boxes: number;
  amount: number;
  reference: string;
};

export async function sendConfirmationEmail(
  params: ConfirmationEmailParams
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

  try {
    const { error } = await resend.emails.send({
      from,
      to: params.to,
      subject: `【台灣優米義賣】登記確認與匯款資訊 - ${params.reference}`,
      html: renderEmailHtml(params),
    });
    if (error) {
      console.error("Resend returned an error", error);
      return { sent: false, reason: error.message };
    }
    return { sent: true };
  } catch (err) {
    console.error("Failed to send confirmation email", err);
    return { sent: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

function renderEmailHtml(params: ConfirmationEmailParams): string {
  const { contactName, orgName, boxes, amount, reference } = params;
  return `
  <div style="font-family: -apple-system, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
    <h2 style="color: #b91c1c;">115年 澳洲雙十國慶 台灣優米義賣活動</h2>
    <p>${contactName} 您好（${orgName}）：</p>
    <p>感謝您參與台灣優米義賣活動！您的登記資料已收到，內容如下：</p>
    <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
      <tbody>
        <tr>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb; background: #f9fafb;">登記編號</td>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb; font-weight: bold;">${reference}</td>
        </tr>
        <tr>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb; background: #f9fafb;">認購箱數</td>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb;">${boxes} 箱（每箱 12 包 / 18公斤）</td>
        </tr>
        <tr>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb; background: #f9fafb;">應付金額</td>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb; font-weight: bold;">AU$${formatAmount(amount)}</td>
        </tr>
      </tbody>
    </table>
    <p><strong>請於匯款備註 (Reference) 欄位填寫登記編號「${reference}」</strong>，以利我們核對款項。</p>
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0 0 8px 0; font-weight: bold;">匯款帳戶資訊</p>
      <p style="margin: 4px 0;">戶名 Account Name：${BANK_INFO.accountName}</p>
      <p style="margin: 4px 0;">BSB：${BANK_INFO.bsb}</p>
      <p style="margin: 4px 0;">帳號 Account Number：${BANK_INFO.accountNumber}</p>
    </div>
    <p>本次義賣所得將全數捐贈予雪梨地區指定慈善單位 Thoracic Oncology Group Australasia (TOGA)，用於支持澳洲胸腔腫瘤（肺癌）研究，感謝您的愛心支持！</p>
    <p>如有任何問題，歡迎與我們聯繫。</p>
    <p style="margin-top: 24px;">台灣優米義賣活動小組 敬上</p>
  </div>
  `;
}
