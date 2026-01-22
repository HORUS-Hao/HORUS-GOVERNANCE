# FACT Mail Log Definition

- 文件：FACT-MAIL-LOG-DEFINITION.md
- 版本：v1.0.0
- 建立日期：2026-01-08
- 狀態：**FACT-OPTIONAL**（定義階段，未要求實作）
- 範圍：S005 / V005

---

## 一、文件目的

為 S005 / V005 定義「Mail 發送 FACT 最小結構」。

**重要聲明**：
- 本文件**僅定義欄位**
- **不指定寫入位置**
- **不要求一定要有 Sheet**
- 標註為 **FACT-OPTIONAL**

---

## 二、Mail Log FACT 最小結構

### 2.1 欄位定義

| 欄位名稱 | 型別 | 必填 | 說明 |
|----------|------|------|------|
| `mail_log_id` | String | ✅ | 郵件記錄唯一識別碼 |
| `mail_type` | Enum | ✅ | 郵件類型 |
| `ref_id` | String | ✅ | 關聯報價單編號 |
| `recipient` | String | ✅ | 收件人 Email |
| `timestamp` | DateTime | ✅ | 發送時間 |
| `result` | Enum | ✅ | 發送結果 |

### 2.2 mail_type 允許值

| 值 | 說明 |
|----|------|
| `QUOTATION` | 正式報價單發送 |
| `APPROVAL_REQUEST` | 送審通知（給 Approver） |
| `REJECT_NOTIFICATION` | 退回通知（給 Creator） |
| `OTP` | OTP 驗證碼發送 |
| `PIN_RESET` | PIN 重設通知 |

### 2.3 result 允許值

| 值 | 說明 |
|----|------|
| `SUCCESS` | 發送成功 |
| `FAILED` | 發送失敗 |
| `PENDING` | 待發送（佇列中） |

---

## 三、擴展欄位（Optional）

以下欄位為可選，視未來需求決定是否納入：

| 欄位名稱 | 型別 | 說明 |
|----------|------|------|
| `cc_recipients` | String[] | 副本收件人列表 |
| `subject` | String | 郵件主旨 |
| `has_attachment` | Boolean | 是否有附件 |
| `attachment_type` | String | 附件類型（PDF / HTML） |
| `error_message` | String | 失敗時的錯誤訊息 |
| `retry_count` | Number | 重試次數 |
| `source_module` | Enum | 來源模組（S005 / V005） |
| `triggered_by` | String | 觸發者 Email |

---

## 四、來源對照（現有程式碼）

### 4.1 S005 Mail 發送點

| 函數 | mail_type | 觸發時機 |
|------|-----------|----------|
| `sendQuotationMail()` | QUOTATION | 發送正式報價 |
| `sendRejectNotification_()` | REJECT_NOTIFICATION | 報價單退回 |
| `sendOtp_()` | OTP | OTP 驗證 |
| `sendPinResetEmail_()` | PIN_RESET | PIN 重設 |

### 4.2 V005 Mail 發送點

| 函數 | mail_type | 觸發時機 |
|------|-----------|----------|
| `MailService.sendQuotationMail()` | QUOTATION | 發送正式報價（Wrapper） |
| `MailService.sendRejectNotification_()` | REJECT_NOTIFICATION | 報價單退回（Wrapper） |

---

## 五、FACT 特性聲明

### 5.1 不可變性

| 規則 | 說明 |
|------|------|
| Immutable | Mail Log 一旦寫入不可修改 |
| Append-only | 只能新增，不能刪除 |
| No Correction | 發送失敗不修改原記錄，新增 retry 記錄 |

### 5.2 來源追溯

| 項目 | 說明 |
|------|------|
| Source Module | S005 或 V005 |
| Write Point | 各 send*() 函數 |
| Trigger | User Action 或 System Event |

---

## 六、儲存策略（未決定）

**本文件不指定儲存位置。** 以下為未來可能的選項：

| 選項 | 說明 | 優點 | 缺點 |
|------|------|------|------|
| Google Sheet | 新增 Mail_Log Sheet | 簡單、可視 | 效能有限 |
| PropertiesService | 儲存於 Script Properties | 快速 | 容量限制 |
| 外部 Log | 儲存於外部服務 | 彈性高 | 複雜度高 |
| 不儲存 | 僅 Console Log | 零成本 | 無法追溯 |

---

## 七、實作狀態

| 項目 | 狀態 |
|------|------|
| 欄位定義 | ✅ 完成 |
| 儲存位置 | ⏸️ 未決定 |
| 寫入實作 | ⏸️ 未啟動 |
| 本文件類型 | **FACT-OPTIONAL** |

---

## 八、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（FACT-OPTIONAL 定義） |

