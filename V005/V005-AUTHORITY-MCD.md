# V005 Authority 最小完成定義（MCD）

- 文件：V005-AUTHORITY-MCD.md
- 版本：v1.0.0
- 建立日期：2026-01-08
- 模組：V005 (Quotation Viewer)
- 層級：Authority (Document / Mail / Stamp / Responsibility)

---

## 一、文件目的

本文件定義 V005 模組 Authority 的**最小完成定義（Minimum Completion Definition）**，聚焦文件輸出與責任鏈。

**盤點原則**：僅盤「是否具備」，不碰 Viewer UI 與 Template 細節。

---

## 二、Authority 要件清單

### 2.1 文件是否可追溯責任

| 檢查項目 | 狀態 | 依據 |
|----------|------|------|
| 是否有唯一文件編號 | ✅ 已具備 | `ref_id` 格式：`{PREFIX}-{YYYYMMDD}-{4digits}` |
| 是否凍結文件內容 | ✅ 已具備 | `quotation_snapshot_json` 凍結報價當下資料 |
| 是否記錄建立者 | ✅ 已具備 | `submitted_by` 欄位（透過 S005） |
| 是否記錄核准者 | ✅ 已具備 | `approved_by`, `approved_at` 欄位 |
| PDF 是否可追溯來源 | ✅ 已具備 | PDF 內含 ref_id、公司資訊、Snapshot 資料 |

**責任鏈追溯**：

```
報價單建立 (submitted_by)
    ↓
送審 (submitted_at)
    ↓
核准 (approved_by, approved_at)
    ↓
發送 (Mail 記錄)
```

**小結**：文件責任追溯 **✅ 已具備**

---

### 2.2 Mail 是否代表正式通知

| 檢查項目 | 狀態 | 依據 |
|----------|------|------|
| 是否有正式發送機制 | ✅ 已具備 | `sendQuotationMail()` 函數 |
| 是否有監管 CC 機制 | ✅ 已具備 | `getSupervisorEmails_()` + 監管 CC |
| 是否附帶正式文件 | ✅ 已具備 | PDF 附件 |
| 是否記錄發送狀態 | ✅ 已具備 | 狀態轉為 `SENT` |
| 是否有發送者識別 | ✅ 已具備 | Mail 來源為系統帳號，代表公司發送 |

**Mail 發送條件**：

| 條件 | 要求 |
|------|------|
| 狀態 | 必須為 `APPROVED` |
| 權限 | 發送者需為 `ISSUER` 或 `APPROVER` |
| 印章 | 自動附加（若已核准） |
| 監管 | 非豁免帳號需 CC 監管人員 |

**小結**：Mail 正式通知 **✅ 已具備**

---

### 2.3 Stamp 是否具法律/內控意義

| 檢查項目 | 狀態 | 依據 |
|----------|------|------|
| 是否有印章管理機制 | ✅ 已具備 | `stamp_file_id` 綁定 Company_Profile |
| 是否限制印章顯示時機 | ✅ 已具備 | 僅 `APPROVED` 狀態顯示印章 |
| 是否與核准流程綁定 | ✅ 已具備 | `approved_stamp_file_id` 記錄核准時的印章 |
| 是否防止未授權使用 | ✅ 已具備 | Drive File ID 私有存取（非公開 URL） |
| 是否凍結於 Snapshot | ✅ 已具備 | `snapshot.stamps.approved_stamp_file_id` |

**印章治理規則**：

| 規則 | 說明 |
|------|------|
| 來源 | 僅從 `Company_Profile.stamp_file_id` 取得 |
| 時機 | 僅在 `APPROVED` 狀態後顯示 |
| 不可逆 | 核准後印章 ID 凍結於 Snapshot |
| 安全性 | 使用 Drive File ID，回傳 Data URL |

**小結**：Stamp 法律/內控意義 **✅ 已具備**

---

### 2.4 責任鏈完整性

| 檢查項目 | 狀態 | 依據 |
|----------|------|------|
| 建立責任 | ✅ 已具備 | `submitted_by` |
| 核准責任 | ✅ 已具備 | `approved_by` |
| 退回責任 | ✅ 已具備 | `rejected_by`, `reject_reason` |
| 發送責任 | ✅ 已具備 | Mail 發送者 + 狀態變更 |
| 時間戳記 | ✅ 已具備 | 各階段皆有 `_at` 欄位 |

**小結**：責任鏈完整性 **✅ 已具備**

---

## 三、總結

### 3.1 Authority 要件彙整

| 要件 | 狀態 |
|------|------|
| 文件可追溯責任 | ✅ 已具備 |
| Mail 代表正式通知 | ✅ 已具備 |
| Stamp 具法律/內控意義 | ✅ 已具備 |
| 責任鏈完整 | ✅ 已具備 |

### 3.2 一句話裁定

> **V005 模組 Authority 層級已達最小完成定義（MCD）。**
> **可宣告 V005 Authority 完成。**

---

## 四、與 S005 Authority 關係

V005 的 Authority 高度依賴 S005：

| V005 Authority | 依賴 S005 |
|----------------|-----------|
| 文件 ref_id | S005 產生 |
| 核准資訊 | S005 寫入 |
| 印章來源 | S005 綁定 Company_Profile |
| 狀態控制 | S005 狀態機 |

**結論**：V005 Authority 完成以 S005 Authority 完成為前提。

---

## 五、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立，Authority MCD 裁定 |

