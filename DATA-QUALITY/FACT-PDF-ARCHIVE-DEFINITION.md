# FACT PDF Archive Definition

- 文件：FACT-PDF-ARCHIVE-DEFINITION.md
- 版本：v1.0.0
- 建立日期：2026-01-08
- 狀態：**FACT-OPTIONAL**（定義階段，未要求實作）
- 範圍：S005 / V005

---

## 一、文件目的

定義「PDF Archive FACT 最小結構」。

**重要聲明**：
- 本文件**僅定義事實**
- **不要求儲存策略**
- 標註為 **FACT-OPTIONAL**

---

## 二、PDF Archive FACT 最小結構

### 2.1 必要欄位

| 欄位名稱 | 型別 | 必填 | 說明 |
|----------|------|------|------|
| `ref_id` | String | ✅ | 關聯報價單編號 |
| `pdf_file_id` | String | ✅ | Google Drive File ID |
| `created_at` | DateTime | ✅ | PDF 產生時間 |
| `source_module` | Enum | ✅ | 來源模組 |

### 2.2 source_module 允許值

| 值 | 說明 |
|----|------|
| `V005` | V005 Quotation Viewer |
| `S005` | S005 Submission Entry（若有） |

---

## 三、擴展欄位（Optional）

以下欄位為可選，視未來需求決定是否納入：

| 欄位名稱 | 型別 | 說明 |
|----------|------|------|
| `pdf_archive_id` | String | PDF 存檔唯一識別碼 |
| `file_name` | String | PDF 檔案名稱 |
| `file_size` | Number | 檔案大小（bytes） |
| `mime_type` | String | MIME 類型（application/pdf） |
| `folder_id` | String | 存放資料夾 Drive ID |
| `status` | Enum | 狀態（CREATED / DELETED） |
| `snapshot_version` | String | 對應 Snapshot 版本 |
| `triggered_by` | String | 產生者 Email |
| `trigger_action` | Enum | 觸發動作（EXPORT / SEND） |
| `checksum` | String | 檔案校驗碼（MD5 / SHA256） |

---

## 四、來源對照（現有程式碼）

### 4.1 V005 PDF 產生點

| 函數 | 觸發時機 | 說明 |
|------|----------|------|
| `PdfService.exportQuotePDF()` | 使用者點擊匯出 | 產生 PDF 並存至 Drive |

### 4.2 相關 Drive 資料夾

| 用途 | 設定方式 | 說明 |
|------|----------|------|
| PDF 存檔 | CONFIG.PDF_FOLDER_ID | 待確認 |

---

## 五、FACT 特性聲明

### 5.1 不可變性

| 規則 | 說明 |
|------|------|
| Immutable | PDF Archive 記錄一旦寫入不可修改 |
| Append-only | 只能新增，不能刪除記錄 |
| File Immutable | PDF 檔案內容不可變更 |

### 5.2 來源追溯

| 項目 | 說明 |
|------|------|
| Source Module | V005（主要） |
| Write Point | `exportQuotePDF()` |
| Input | ref_id + htmlContent |
| Output | pdf_file_id |

### 5.3 與 Snapshot 關係

| 關係 | 說明 |
|------|------|
| 依賴 | PDF 內容基於 `quotation_snapshot_json` |
| 時間點 | PDF 產生時間應 ≥ Snapshot 建立時間 |
| 版本對應 | PDF 應記錄對應的 snapshot_version |

---

## 六、儲存策略（未決定）

**本文件不指定儲存策略。** 以下為未來可能的選項：

### 6.1 PDF 檔案儲存

| 選項 | 說明 |
|------|------|
| Google Drive | 目前使用方式 |
| Cloud Storage | 未來可能擴展 |

### 6.2 Archive 記錄儲存

| 選項 | 說明 | 優點 | 缺點 |
|------|------|------|------|
| Google Sheet | 新增 PDF_Archive Sheet | 簡單、可視 | 效能有限 |
| S005_QUOTES 欄位 | 新增 pdf_file_id 欄位 | 關聯緊密 | 欄位膨脹 |
| 不儲存記錄 | 僅儲存檔案 | 簡單 | 無法追溯 |

---

## 七、實作狀態

| 項目 | 狀態 |
|------|------|
| 欄位定義 | ✅ 完成 |
| 儲存策略 | ⏸️ 未決定 |
| 寫入實作 | ⏸️ 未啟動 |
| 本文件類型 | **FACT-OPTIONAL** |

---

## 八、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（FACT-OPTIONAL 定義） |

