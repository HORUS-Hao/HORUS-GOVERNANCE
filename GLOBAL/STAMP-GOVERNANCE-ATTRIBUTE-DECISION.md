# Stamp Governance — Attribute Decision

- Module: GLOBAL
- File: STAMP-GOVERNANCE-ATTRIBUTE-DECISION.md
- Version: v1.0.0
- Effective Date: 2026-01-08
- Status: **Active**
- Related Documents:
  - DATA-CONTRACT-STAMP.md
  - DATA-CONTRACT-RUNTIME-AUDIT.md
  - GOVERNANCE-MULTI-STAMP.md

---

## 一、Purpose

本文件針對 Data Contract 定義但 Runtime 尚未實作之印章屬性，進行治理層裁定。

**涉及屬性**：
- `is_active`
- `content_type`

---

## 二、is_active 治理定義

### 2.1 用途

| 項目 | 說明 |
|------|------|
| 定位 | 標示印章是否為該公司當前使用中之印章 |
| 應用場景 | 多印章並存時，識別哪一個為 active |
| 決策依據 | 核准時應取用 `is_active = true` 之印章 |

### 2.2 狀態語意

| 值 | 語意 | 說明 |
|----|------|------|
| `true` | 使用中 | 該公司目前使用之印章，可用於核准 |
| `false` | 歸檔 | 歷史印章，僅供稽核，不可用於新核准 |

### 2.3 不寫入 Runtime 的理由

| 理由 | 說明 |
|------|------|
| 現況充分 | 目前每家公司僅維護一個 `stamp_file_id`，無多印章並存需求 |
| 隱含語意 | `Company_Profile.stamp_file_id` 本身即代表 active 印章 |
| 風險控制 | 新增欄位將影響既有查詢邏輯，需完整測試 |
| 治理優先 | 應先完成多公司隔離，再處理多印章管理 |

### 2.4 未來啟用條件

- 需求：單一公司需管理多個印章（如：發票章、報價章、合約章）
- 前置：完成 Phase 3 多公司隔離
- 啟動：Architect 明確裁定啟動多印章管理

---

## 三、content_type 治理定義

### 3.1 使用場景

| 場景 | 說明 |
|------|------|
| 多印章管理 | 區分不同格式之印章檔案 |
| 多文件類型 | 擴充至其他文件類型（如：簽名、騎縫章） |
| 格式驗證 | 確保上傳檔案符合允許格式 |

### 3.2 可擴充值域

| 值 | 說明 | 狀態 |
|----|------|------|
| `image/png` | PNG 圖片（透明背景優先） | 建議 |
| `image/jpeg` | JPEG 圖片 | 允許 |
| `image/gif` | GIF 圖片 | 保留 |
| `image/webp` | WebP 圖片 | 保留 |
| `application/pdf` | PDF 文件（未來擴充） | 保留 |

### 3.3 不寫入 Runtime 的理由

| 理由 | 說明 |
|------|------|
| 動態取得 | 目前由 `DriveApp.getFileById().getBlob().getContentType()` 動態取得 |
| 無需儲存 | 每次轉換為 Data URL 時即可取得 MIME type |
| 彈性優先 | 避免儲存後與實際檔案不一致 |
| 簡化治理 | 減少需同步維護之欄位 |

### 3.4 未來啟用條件

- 需求：需要在上傳時驗證檔案格式
- 需求：需要在 UI 顯示檔案類型
- 啟動：Architect 明確裁定啟動格式管理

---

## 四、裁定事項

### 4.1 Phase 2 裁定

| 裁定 | 說明 |
|------|------|
| `is_active` | ❌ Phase 2 **不寫入程式碼** |
| `content_type` | ❌ Phase 2 **不寫入程式碼** |
| 理由 | Phase 2 僅處理 Data Contract 定義，不改變 Runtime 行為 |

### 4.2 Phase 3 以後裁定

| 裁定 | 說明 |
|------|------|
| `is_active` | 作為 Phase 3+ 多印章管理之 migration 依據 |
| `content_type` | 作為 Phase 3+ 格式管理之 migration 依據 |
| 啟動條件 | 需 Architect 明確裁定啟動 |

### 4.3 明確禁止

| 禁止事項 | 說明 |
|----------|------|
| 提前實作 | 未經裁定不得新增 `is_active` / `content_type` 欄位 |
| 修改 Runtime | 本文件不授權任何 .gs 修改 |
| 自行擴充 | 不得自行新增其他印章屬性 |

---

## 五、與既有治理文件之關係

| 文件 | 關係 |
|------|------|
| DATA-CONTRACT-STAMP.md | 本文件補充說明 Contract 中未實作欄位之治理定位 |
| DATA-CONTRACT-RUNTIME-AUDIT.md | 本文件回應 Audit 報告中之「缺失項目」 |
| GOVERNANCE-MULTI-STAMP.md | 本文件為多印章治理之延伸裁定 |

---

## 六、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（Phase 2 裁定） |

