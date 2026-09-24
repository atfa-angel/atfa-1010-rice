# 台灣優米義賣登記網

115年澳洲雙十國慶「台灣優米義賣活動」的線上登記系統。

功能：

- 公開登記表單：填寫單位/姓名、聯絡人、電話、Email、認購箱數
- 送出後自動寄送確認信（含匯款帳號資訊、登記編號）到登記人 Email，並同時在網頁上顯示同樣的資訊
- 內部後台（`/admin`，密碼保護）：檢視所有登記、統計總箱數/總金額/已收款/未收款，並可按鈕標記「已收款」

## 技術棧

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Prisma 6 + PostgreSQL
- Resend（寄送確認信）

## 本機開發設定

1. 安裝套件（已完成）：

   ```bash
   npm install
   ```

2. 複製環境變數範本並填入實際值：

   ```bash
   cp .env.example .env.local
   ```

   需要填入：

   | 變數 | 說明 |
   | --- | --- |
   | `DATABASE_URL` | Postgres 連線字串。建議用 [Neon](https://neon.tech)（免費）或 Vercel Postgres |
   | `RESEND_API_KEY` | [Resend](https://resend.com) 的 API Key，用來自動寄送確認信 |
   | `EMAIL_FROM` | 寄件者地址。尚未驗證自己網域前可先用 `onboarding@resend.dev` 測試（**但這個測試寄件位址在未驗證網域前，只能寄到你自己註冊 Resend 帳號的 Email**，正式上線前建議在 Resend 驗證一個網域，例如 `noreply@你的網域`） |
   | `ADMIN_PASSWORD` | 後台登入密碼，內部人員共用 |
   | `ADMIN_SESSION_SECRET` | 後台登入 session 簽章用的亂數字串，執行 `openssl rand -hex 32` 產生一組即可 |

3. 建立資料表：

   ```bash
   npx prisma db push
   ```

4. 啟動開發伺服器：

   ```bash
   npm run dev
   ```

   開啟 http://localhost:3000 看登記表單，http://localhost:3000/admin 看後台。

## 部署到 Vercel

1. 把這個專案 push 到 GitHub（或其他 Git 平台）。
2. 到 [vercel.com](https://vercel.com) 用同一個 GitHub 帳號登入，選擇這個 repo 建立新專案。
3. 在 Vercel 專案的 **Storage** 分頁新增 **Postgres**（由 Neon 提供，免費額度足夠這個活動使用），建立後它會自動幫你把 `DATABASE_URL` 加進環境變數。
4. 在 Vercel 專案的 **Settings → Environment Variables** 補上其餘變數：`RESEND_API_KEY`、`EMAIL_FROM`、`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`。
5. 部署完成後，到本機（或用 Vercel 的 Terminal / CLI）針對正式環境的資料庫執行一次建表：

   ```bash
   DATABASE_URL="<正式環境的連線字串>" npx prisma db push
   ```

6. 之後每次 `git push` 到主分支，Vercel 都會自動重新部署。

## 後台使用方式

1. 到 `/admin` 輸入密碼登入。
2. 頁面上方會顯示：登記筆數、總箱數、應收總額、已收款金額、未收款金額。
3. 表格中每一筆登記都有「標記已收款」按鈕，收到匯款後按一下即可，會記錄收款時間；按一次可再取消。
4. 表格會顯示每筆登記的登記編號（例如 `ATFA1010-0007`）、寄信是否成功等資訊。

## 匯款資訊（寫在 `lib/bank.ts`、`lib/email.ts`）

- 戶名 Account Name：Australian Taiwanese Friendship Assoc.
- BSB：082201
- 帳號 Account Number：653876771

金額規則（`lib/pricing.ts`）：每包 1.5kg / AU$10.10，每箱 12 包（18kg）/ AU$121.20，登記箱數 × $121.20 為應付金額。若日後價格調整，直接修改 `lib/pricing.ts` 即可。
