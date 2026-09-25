import { Resend } from "resend";
import { BANK_INFO } from "./bank";
import { BOX_PRICE, PACK_PRICE, PICKUP_NOTE, formatAmount, formatQuantity } from "./pricing";

export type ConfirmationEmailParams = {
  to: string;
  contactName: string;
  orgName: string;
  boxes: number;
  packs: number;
  amount: number;
  reference: string;
};

const BRAND = "#1e511f";
const BRAND_SOFT = "#eaf3ea";
const BRAND_BORDER = "#bbd5bc";
const LOGO_URL = process.env.SITE_URL
  ? `${process.env.SITE_URL.replace(/\/$/, "")}/atfa-logo.png`
  : "https://www.atfa.org.au/client_images/2706663.png";

export async function sendConfirmationEmail(
  params: ConfirmationEmailParams
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const replyTo = process.env.REPLY_TO_EMAIL || undefined;

  try {
    const { error } = await resend.emails.send({
      from,
      to: params.to,
      replyTo,
      subject: `【台灣優米義賣】登記確認與匯款資訊（${params.reference}）`,
      html: renderEmailHtml(params),
      text: renderEmailText(params),
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string, opts?: { strong?: boolean; color?: string }): string {
  return `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid ${BRAND_BORDER};color:#666666;font-size:14px;width:38%;vertical-align:top;">${label}</td>
      <td style="padding:9px 0;border-bottom:1px solid ${BRAND_BORDER};font-size:14px;color:${opts?.color ?? "#333333"};${
        opts?.strong ? "font-weight:700;" : ""
      }">${value}</td>
    </tr>`;
}

export function renderEmailHtml(params: ConfirmationEmailParams): string {
  const contactName = escapeHtml(params.contactName);
  const orgName = escapeHtml(params.orgName);
  const reference = escapeHtml(params.reference);
  const amount = formatAmount(params.amount);
  const quantity = formatQuantity(params.boxes, params.packs);

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>台灣優米義賣登記確認</title>
</head>
<body style="margin:0;padding:0;background:#f5f8f5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">您的登記編號 ${reference}，應付金額 AU$${amount}，匯款資訊請見內文。</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8f5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${BRAND_BORDER};border-radius:12px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang TC','Microsoft JhengHei','Noto Sans TC',Arial,sans-serif;color:#333333;">

          <tr>
            <td style="padding:20px 28px;background:#ffffff;">
              <img src="${LOGO_URL}" alt="澳洲臺灣同鄉會 Australian Taiwanese Friendship Association" width="260" style="display:block;width:260px;max-width:100%;height:auto;border:0;">
            </td>
          </tr>

          <tr>
            <td style="background:${BRAND};padding:28px;text-align:center;">
              <div style="font-size:13px;letter-spacing:1px;color:${BRAND_BORDER};">115年 澳洲雙十國慶</div>
              <div style="font-size:24px;font-weight:700;color:#ffffff;margin-top:6px;">台灣優米義賣活動</div>
              <div style="font-size:15px;color:#ffffff;margin-top:8px;">登記確認與匯款資訊</div>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 8px 28px;font-size:15px;line-height:1.8;">
              <p style="margin:0 0 12px 0;font-weight:700;font-size:16px;">${contactName} 您好，</p>
              <p style="margin:0 0 12px 0;">感謝您（${orgName}）響應「115年 澳洲雙十國慶 台灣優米義賣活動」，您的登記已經收到！所得將全數捐贈給慈善單位，您的愛心將幫助更多人。</p>
              <p style="margin:0;">請參考下方資訊完成匯款，我們收到款項並核對後，就完成您的認購。</p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 8px 28px;">
              <div style="font-size:16px;font-weight:700;color:${BRAND};border-left:4px solid ${BRAND};padding-left:10px;margin-bottom:8px;">登記資料</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("登記編號", reference, { strong: true })}
                ${row("認購單位／姓名", orgName)}
                ${row("認購數量", quantity)}
                ${row("單價", `AU$${formatAmount(BOX_PRICE)} ／箱（每箱 12 包／18 公斤）<br>AU$${formatAmount(PACK_PRICE)} ／包（1.5 公斤）`)}
                ${row("應付金額", `<span style="font-size:20px;">AU$${amount}</span>`, { strong: true, color: BRAND })}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 8px 28px;">
              <div style="font-size:16px;font-weight:700;color:${BRAND};border-left:4px solid ${BRAND};padding-left:10px;margin-bottom:12px;">匯款資訊</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_SOFT};border:1px solid ${BRAND_BORDER};border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;font-size:15px;line-height:2;">
                    <div><span style="color:#666666;">戶名 Account Name</span><br><strong>${escapeHtml(BANK_INFO.accountName)}</strong></div>
                    <div style="margin-top:6px;"><span style="color:#666666;">BSB</span><br><strong style="font-size:18px;letter-spacing:1px;">${BANK_INFO.bsb}</strong></div>
                    <div style="margin-top:6px;"><span style="color:#666666;">帳號 Account Number</span><br><strong style="font-size:18px;letter-spacing:1px;">${BANK_INFO.accountNumber}</strong></div>
                    <div style="margin-top:6px;"><span style="color:#666666;">匯款金額 Amount</span><br><strong style="font-size:18px;color:${BRAND};">AU$${amount}</strong></div>
                    <div style="margin-top:6px;"><span style="color:#666666;">備註 Reference（請務必填寫）</span><br><strong style="font-size:18px;color:#b91c1c;">${reference}</strong></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 8px 28px;font-size:14px;line-height:1.8;">
              <div style="font-size:16px;font-weight:700;color:${BRAND};border-left:4px solid ${BRAND};padding-left:10px;margin-bottom:8px;">匯款步驟</div>
              <ol style="margin:0;padding-left:20px;">
                <li>使用網路銀行或手機銀行，轉帳至上方帳戶（BSB＋帳號）。</li>
                <li>匯款金額請填 <strong>AU$${amount}</strong>。</li>
                <li>備註／Reference 欄位請填 <strong style="color:#b91c1c;">${reference}</strong>，方便我們核對款項。</li>
                <li>為利於 10 月 10 日前彙整捐款金額，請您儘早完成匯款。</li>
              </ol>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 8px 28px;font-size:14px;line-height:1.8;">
              <div style="font-size:16px;font-weight:700;color:${BRAND};border-left:4px solid ${BRAND};padding-left:10px;margin-bottom:8px;">取貨說明</div>
              <p style="margin:0;">${PICKUP_NOTE}請留意您的 Email 與電話。</p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 8px 28px;font-size:14px;line-height:1.8;">
              <div style="font-size:16px;font-weight:700;color:${BRAND};border-left:4px solid ${BRAND};padding-left:10px;margin-bottom:8px;">捐款去向</div>
              <p style="margin:0;">雪梨地區的義賣所得將全數捐給 <strong>Thoracic Oncology Group Australasia（TOGA）</strong>，支持澳洲胸腔腫瘤（肺癌）研究，並於今年雪梨僑界國慶晚宴上，邀請 TOGA 代表出席並進行捐贈儀式。</p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 28px 28px;font-size:14px;line-height:1.8;">
              <p style="margin:0 0 4px 0;">再次感謝您的愛心支持！如有任何問題，歡迎與澳洲臺灣同鄉會聯繫。</p>
              <p style="margin:12px 0 0 0;font-weight:700;">澳洲臺灣同鄉會 敬上</p>
            </td>
          </tr>

          <tr>
            <td style="background:${BRAND};padding:16px 28px;text-align:center;font-size:12px;line-height:1.7;color:${BRAND_BORDER};">
              澳洲臺灣同鄉會 Australian Taiwanese Friendship Association<br>
              <a href="https://www.atfa.org.au" style="color:#ffffff;text-decoration:underline;">www.atfa.org.au</a><br>
              此信件由系統自動寄出，請保留以便匯款核對。
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderEmailText(params: ConfirmationEmailParams): string {
  const amount = formatAmount(params.amount);
  return `${params.contactName} 您好，

感謝您（${params.orgName}）響應「115年 澳洲雙十國慶 台灣優米義賣活動」，您的登記已經收到！

【登記資料】
登記編號：${params.reference}
認購數量：${formatQuantity(params.boxes, params.packs)}
單價：AU$${formatAmount(BOX_PRICE)} ／箱（每箱 12 包／18 公斤）；AU$${formatAmount(PACK_PRICE)} ／包（1.5 公斤）
應付金額：AU$${amount}

【匯款資訊】
戶名 Account Name：${BANK_INFO.accountName}
BSB：${BANK_INFO.bsb}
帳號 Account Number：${BANK_INFO.accountNumber}
匯款金額：AU$${amount}
備註 Reference（請務必填寫）：${params.reference}

【匯款步驟】
1. 使用網路銀行或手機銀行，轉帳至上方帳戶。
2. 匯款金額請填 AU$${amount}。
3. 備註／Reference 欄位請填 ${params.reference}，方便我們核對款項。
4. 為利於 10 月 10 日前彙整捐款金額，請您儘早完成匯款。

【取貨說明】
${PICKUP_NOTE}請留意您的 Email 與電話。

【捐款去向】
雪梨地區的義賣所得將全數捐給 Thoracic Oncology Group Australasia（TOGA），支持澳洲胸腔腫瘤（肺癌）研究。

再次感謝您的愛心支持！

澳洲臺灣同鄉會 敬上
https://www.atfa.org.au
`;
}
