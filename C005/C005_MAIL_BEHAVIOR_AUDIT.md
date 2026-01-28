# C005 Mail Behavior Audit

> **Status**: SEALED / READ-ONLY AUDIT
> **Audit Date**: 2026-01-26
> **Version**: v1.0.0
> **Auditor**: Claude Code (Phase 2 Go-Live)
> **Scope**: Mail sending behavior, recipient logic, fallback behavior

---

## 1. EXECUTIVE SUMMARY

本文件為 C005 Mail 子系統的行為審計，涵蓋：
- Mail 觸發條件
- Mail 阻止條件
- 收件人邏輯
- 寫入防護機制
- 架構位置發現

### 關鍵發現

| 項目 | 發現 |
|------|------|
| **Mail 程式碼位置** | `R020-Price-Comparator/_clasp-observer-mail/`（非 C005-Listing-Checker） |
| **寫入防護** | R020_WriteFence.js - 目前 **全部禁止** (Phase R) |
| **Mail 觸發** | 每日必寄（治理裁定 2026-01-04） |
| **收件人** | 硬編碼 `hao.chang@horus.tw`，無 supervisor_emails fallback |

---

## 2. MAIL CODE LOCATION

### 2.1 實際位置（非預期）

C005 Mail 相關程式碼**不在** `C005-Listing-Checker/webapp`，而是位於：

```
10-基礎服務層-BASE-SERVICES/
├── R020-Price-Comparator/
│   └── _clasp-observer-mail/              ← C005 Mail 實際位置
│       ├── C005_MailService.js            ← 主 Mail 服務 (v1.11.0)
│       ├── C005_SyncJob.js                ← 同步 Job (v1.6.0)
│       ├── C005_FactWriter.js             ← FACT 寫入器
│       ├── C005_Phase6_SKUListingMail.js  ← Phase 6 SKU Mail
│       ├── C005_Phase7_BusinessDecisionMail.js ← Phase 7 Mail
│       ├── Config.js                      ← 配置（含收件人）
│       └── R020_WriteFence.js             ← 寫入防護
│
└── C005-Decision-Mail-Phase7/
    └── _clasp/
        └── BusinessDecisionMail.js        ← Phase 7 經營判斷 Mail (v1.7.0)
```

### 2.2 架構說明

- **R020-Price-Comparator** 模組同時承載 R020/R021/C005 的 Mail 服務
- C005-Listing-Checker/webapp 的 `MailService.js` 僅有 `.bak` 檔案
- 此為 **共用 clasp 專案**，非 C005 獨立部署

---

## 3. MAIL SEND CONDITIONS

### 3.1 觸發條件

```javascript
// C005_MailService.js:250-253
function checkSendCondition(context) {
  // 治理裁定：每日必寄，不再有 SKIP
  return { send: true, reason: "每日必寄（治理裁定 2026-01-04）" };
}
```

**結論**：C005 Mail 採用「每日必寄」政策，無條件觸發。

### 3.2 阻止條件

| 條件 | 行為 | 程式碼位置 |
|------|------|-----------|
| `CONFIG.MAIL.ENABLED = false` | 跳過發送 | C005_MailService.js:126 |
| `CONFIG.MAIL.RECIPIENTS` 為空 | 跳過發送 | C005_MailService.js:135 |
| `R020_WRITE_GUARD.allowMailSend = false` | **拋出錯誤** | R020_WriteFence.js:10-11 |

### 3.3 R020 寫入防護（當前狀態）

```javascript
// R020_WriteFence.js
const R020_WRITE_GUARD = {
  allowSpreadsheetWrite: false,
  allowMailSend: false,      // ← 目前禁止
  allowDriveWrite: false,
  reason: 'Phase R - Risk Containment (Architect Locked)'
};
```

**重要**：目前 R020 模組處於 **Phase R (Risk Containment)**，所有寫入操作（包含 Mail）均被禁止。

---

## 4. RECIPIENT LOGIC

### 4.1 C005 Main Mail

```javascript
// Config.js:118-141
var CONFIG = {
  EMAIL_RECIPIENTS: 'hao.chang@horus.tw',
  MAIL: {
    ENABLED: true,
    RECIPIENTS: ['hao.chang@horus.tw'],
    CC: [],
    SUBJECT_PREFIX: '[C005]',
  }
};
```

| 欄位 | 值 | 說明 |
|------|-----|------|
| `EMAIL_RECIPIENTS` | `hao.chang@horus.tw` | 向後相容欄位 |
| `MAIL.RECIPIENTS` | `['hao.chang@horus.tw']` | 主要收件人陣列 |
| `MAIL.CC` | `[]` | 空陣列（無 CC） |

### 4.2 Phase 7 Business Decision Mail

```javascript
// BusinessDecisionMail.js (C005-Decision-Mail-Phase7)
// sendPhase7BusinessDecisionMail():998-1000
MailApp.sendEmail({
  to: PHASE7_CONFIG.EMAIL_RECIPIENTS,
  subject: warningMail.subject,
  htmlBody: warningMail.body
});
```

**注意**：Phase 7 使用獨立的 `PHASE7_CONFIG.EMAIL_RECIPIENTS`，需確認其定義。

### 4.3 supervisor_emails Fallback

**審計結論**：C005 Mail 系統 **無** `supervisor_emails` fallback 機制。

- 無動態收件人查詢
- 無根據 company/company_code 的收件人映射
- 所有收件人皆為 Config.js 硬編碼

---

## 5. MAIL CONTENT STRUCTURE

### 5.1 Daily Summary Mail

```javascript
// sendDailySummaryMail() 產出結構
{
  subject: '[C005] 每日上架狀態彙整報告 - YYYY-MM-DD [STATUS_MARK]',
  body: {
    html: '...',  // buildHtmlContent()
    plain: '...'  // buildPlainContent()
  }
}
```

### 5.2 Mail 區塊（HTML）

| 區塊 | 說明 | 條件 |
|------|------|------|
| ① 最新可用上架現況總覽 | 平台 × 商品統計 | 永遠顯示 |
| ② 與前一日差異摘要 | 變動偵測 | 今日有 FACT 才顯示 |
| ③ 治理判斷 | 人員/系統責任歸因 | 永遠顯示 |
| ⑤ 治理揭露 | Phase D-2 disclaimer | 永遠顯示 |
| ⑥ 平台狀態說明 | Shopee Observation 等 | 永遠顯示 |
| ⑦ 決策信心等級 | Phase D-4 | 有資料時顯示 |

### 5.3 NO_FACT 分支政策

```
治理裁定 2026-01-22：NO_FACT 分支政策
┌─────────────────────────────────────────────────────────────────┐
│ NO_FACT 定義：!currentOverview.isLatestDate（今日無 FACT）        │
│ NO_FACT 時隱藏：① 平台表、比對摘要、② 差異摘要                    │
│ NO_FACT 時保留：③ 治理判斷、系統資訊                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. WRITE OPERATIONS

### 6.1 assertWriteAllowed_() 調用點

| 檔案 | 行號 | 類型 | 說明 |
|------|-----|------|------|
| C005_MailService.js | 218 | `MAIL` | 發送 Mail 前 |
| C005_SyncJob.js | 579 | `SPREADSHEET` | 寫入 C005 Derived |
| C005_SyncJob.js | 932 | `SPREADSHEET` | 寫入 EligibilityEvidence |
| C005_FactWriter.js | 144 | `SPREADSHEET` | 寫入 FACT |
| C005_FactWriter.js | 527, 632, 712 | `SPREADSHEET` | 其他寫入 |

### 6.2 當前狀態

```
R020_WRITE_GUARD 狀態：
- allowSpreadsheetWrite: false ❌
- allowMailSend: false ❌
- allowDriveWrite: false ❌
- reason: Phase R - Risk Containment (Architect Locked)
```

**結論**：R020 模組下的所有 C005 Mail/Write 操作目前被防護機制阻擋。

---

## 7. DATA FLOW

### 7.1 Mail 資料來源

```
D005 FACT (Listing_History)
    ↓ readFactData_()
C005_SyncJob.js
    ↓ aggregateByPlatformDate_()
C005 Derived Sheet
    ↓ getCurrentListingOverview()
C005_MailService.js
    ↓ buildMailContent()
MailApp.sendEmail()
```

### 7.2 資料讀取權限

| 資料源 | 權限 | 說明 |
|--------|------|------|
| D005 FACT | READ-ONLY | 只讀，不修改 |
| T005 商品主表 | READ-ONLY | Eligibility 來源 |
| C005 Derived | READ/WRITE | 聚合結果 |
| Strategy SSOT | READ-ONLY | Phase 7 使用 |

---

## 8. GOVERNANCE COMPLIANCE

### 8.1 T005 欄位限制

```javascript
// C005_MailService.js:16-27
// ALLOWED T005 Fields:
// - UID, 供應商, 品牌, 商品型號, 商品名稱, 商品大類, 商品中類, 商品小類, 國際條碼
// - 商品狀態, 付款條件 (display only, no interpretation)

// FORBIDDEN T005 Fields:
// - 商品歸屬公司, 可銷售公司

// FORBIDDEN Actions:
// - if/switch based on T005 fields
// - Listing rate calculation adjustment
// - Eligibility inference
// - strategy_mapping decision
```

### 8.2 治理裁定遵循

| 裁定日期 | 內容 | 狀態 |
|----------|------|------|
| 2026-01-04 | 每日必寄 | ✅ 遵循 |
| 2026-01-22 | NO_FACT 分支政策 | ✅ 遵循 |
| 2026-01-23 | SHOPEE 拆分 | ✅ 遵循 |
| 2026-01-24 | Phase D-2 Decision Contract | ✅ 遵循 |
| 2026-01-26 | Phase D-4 Confidence Guard | ✅ 遵循 |

---

## 9. RISK ASSESSMENT

### 9.1 已識別風險

| 風險 | 等級 | 說明 | 緩解措施 |
|------|------|------|----------|
| 硬編碼收件人 | LOW | 無法動態調整收件人 | 可接受（內部系統） |
| 共用 clasp 專案 | MEDIUM | R020/R021/C005 耦合 | 未來可拆分 |
| R020 Phase R 鎖定 | HIGH | 所有寫入被阻擋 | 需 Architect 解鎖 |

### 9.2 Phase 2 Go-Live 影響

若要啟用 C005 Mail：
1. 需修改 `R020_WRITE_GUARD.allowMailSend = true`
2. 需 Architect 核准解除 Phase R 鎖定
3. 或將 C005 Mail 遷移至獨立部署

---

## 10. RECOMMENDATIONS

### 10.1 短期（Go-Live）

1. **解鎖 Mail 發送**：修改 `R020_WriteFence.js` 中 `allowMailSend = true`
2. **驗證收件人**：確認 `hao.chang@horus.tw` 為正確收件人

### 10.2 中期（Phase 3+）

1. **架構遷移**：將 C005 Mail 從 R020 專案獨立出來
2. **收件人動態化**：考慮引入 supervisor_emails 映射機制
3. **CC 啟用**：根據業務需求設定 CC 收件人

---

## 11. AUDIT SEAL

```
SEALED: 2026-01-26
AUDITOR: Claude Code (Phase 2 Go-Live)
SCOPE: C005 Mail Behavior
CONCLUSION: R020 Phase R 鎖定中，Mail 發送被阻擋
NEXT_ACTION: Architect 決定是否解鎖 R020_WriteFence
```

---

## 12. APPENDIX: FILE INVENTORY

### 12.1 C005 Mail 相關檔案

| 檔案 | 版本 | 行數 | 功能 |
|------|------|------|------|
| C005_MailService.js | v1.11.0 | 1500+ | 主 Mail 服務 |
| C005_SyncJob.js | v1.6.0 | 1864 | 同步 Job + Confidence Guard |
| C005_FactWriter.js | - | - | FACT 寫入器 |
| Config.js | v1.0.0 | 400+ | 配置定義 |
| R020_WriteFence.js | - | 19 | 寫入防護 |
| BusinessDecisionMail.js | v1.7.0 | 1044 | Phase 7 經營判斷 |

### 12.2 相關治理文件

- C005-PHASE-D-2-DECISION-CONTRACT.md
- C005_MAIL_SEMANTIC_GUARDS.md
- C005_MAIL_CONFIDENCE_GUARD.md
- ADR-C005-SHOPEE-OBSERVATION-STATUS.md
