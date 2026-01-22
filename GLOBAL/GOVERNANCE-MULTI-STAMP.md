# Multi-Stamp Governance

- Module: GLOBAL
- File: GOVERNANCE-MULTI-STAMP.md
- Version: v1.0.0
- Effective Date: 2026-01-08
- Status: **Active**

---

## 一、Purpose（目的與適用範圍）

本文件定義 HORUS-PDM 系統中「多印章」治理模型之概念與邊界。

**適用範圍**：
- 所有涉及印章識別、印章使用、印章管理之模組
- S005、V005 及其他依賴印章功能之服務

**目的**：
- 確立印章作為法律效力憑證之治理單位
- 定義印章與公司、文件之關係
- 規範印章使用之紅線與禁止事項

---

## 二、Stamp 定義

### 2.1 StampId（印章識別碼）

| 屬性 | 說明 |
|------|------|
| 識別方式 | `stamp_file_id`（Google Drive File ID） |
| 格式 | Drive File ID 字串 |
| 來源 | `Company_Profile.stamp_file_id` |
| 不可變性 | 同一印章之 File ID 不變；更換印章需更新 File ID |

### 2.2 Stamp 屬性

| 屬性 | 說明 |
|------|------|
| `stamp_file_id` | 印章檔案 Drive File ID |
| `company_code` | 所屬公司識別碼 |
| 檔案格式 | PNG / JPEG（透明背景優先） |
| 存放位置 | `HORUS-GOVERNANCE/STAMPS/companies/{company}/active/` |

### 2.3 所屬 Company

- 每個印章歸屬單一公司
- 印章與公司之關聯由 `Company_Profile.stamp_file_id` 定義
- 一家公司可擁有多個印章（但僅一個為 active）

---

## 三、印章與文件關聯原則

### 3.1 關聯時機

| 時機 | 說明 |
|------|------|
| 核准時 | 報價單核准時，將 `stamp_file_id` 寫入 Snapshot |
| 凍結 | 印章 File ID 一經寫入 Snapshot，不可變更 |
| 顯示 | 前端顯示印章依據 Snapshot 中之 File ID |

### 3.2 關聯原則

- 印章關聯基於 File ID，非資料夾掃描
- 印章決策來源為 `Company_Profile.stamp_file_id`
- FACTS/STAMPS 資料夾僅供歸檔與稽核，不作為決策輸入

### 3.3 Snapshot 欄位

| 欄位 | 說明 |
|------|------|
| `stamps.draft_stamp_file_id` | 草稿章 File ID（預設空） |
| `stamps.approved_stamp_file_id` | 核准章 File ID |

---

## 四、印章與使用者關係

### 4.1 使用權限

| 角色 | 可使用印章 | 可管理印章 |
|------|------------|------------|
| APPROVER | ✅ | ✅ |
| ISSUER | ❌（間接使用） | ❌ |
| CREATOR | ❌ | ❌ |
| VIEWER | ❌ | ❌ |

### 4.2 使用規則

- 僅 `APPROVER` 可執行核准操作，觸發印章蓋印
- `ISSUER` 發送已核准報價單時，印章已存於 Snapshot，無需再次取用
- 印章管理（更換、新增）需由 `APPROVER` 執行

### 4.3 不可使用情境

- 未具備該公司 `APPROVER` 角色之使用者不可觸發蓋印
- 未核准之報價單不顯示核准章

---

## 五、多印章並存規則

### 5.1 並存定義

- 一家公司可維護多個印章檔案
- 僅一個印章為 `active`（記錄於 `Company_Profile.stamp_file_id`）
- 歷史印章保留於 `HORUS-GOVERNANCE/STAMPS/` 歸檔區

### 5.2 印章類型

| 類型 | 說明 |
|------|------|
| 預設章 | `Company_Profile.stamp_file_id`，用於核准 |
| 草稿章 | `draft_stamp_file_id`（目前未啟用） |
| 歸檔章 | 歷史印章，僅供稽核 |

### 5.3 更換流程

- 更換印章需更新 `Company_Profile.stamp_file_id`
- 舊印章移至歸檔區
- 已核准報價單之印章不受影響（依據 Snapshot）

---

## 六、印章治理紅線（禁止事項）

以下行為 **絕對禁止**：

| 禁止事項 | 說明 |
|----------|------|
| 跨公司使用 | 不得將 A 公司印章用於 B 公司報價單 |
| 未授權蓋印 | 非 APPROVER 不得觸發蓋印操作 |
| 資料夾掃描決策 | 不得掃描 STAMPS 資料夾作為印章選擇依據 |
| 修改已凍結印章 | 不得修改已寫入 Snapshot 之印章 File ID |
| 公開印章檔案 | 印章檔案不得設為公開存取 |
| 繞過 File ID | 不得使用公開 URL 取代 File ID |

---

## 七、與 S005 / V005 的關係

### 7.1 S005（Submission Entry）

- S005 建立報價單時，Snapshot 之 `stamps` 欄位初始為空
- S005 核准操作時，將 `Company_Profile.stamp_file_id` 寫入 Snapshot
- S005 記錄 `approved_stamp_file_id` 於報價單欄位

### 7.2 V005（Quotation Viewer）

- V005 顯示印章時，依據 Snapshot 之 `stamps.approved_stamp_file_id`
- V005 呼叫 `getStampDataUrl(fileId)` 將 File ID 轉為 Data URL
- V005 不掃描資料夾、不推斷印章來源

### 7.3 治理通知

```
═══════════════════════════════════════════════════════════════════════════
GOVERNANCE NOTICE — Stamp Rendering (Architect Ruling 2026-01-07)
═══════════════════════════════════════════════════════════════════════════
Viewer renders stamp STRICTLY by File ID provided in Snapshot.
Folder content under FACTS/STAMPS must NEVER be used as decision input.
This is a LEGAL governance boundary. Do NOT modify without Architect approval.
═══════════════════════════════════════════════════════════════════════════
```

---

## 八、生效與裁定方式

### 8.1 生效條件

本文件自 2026-01-08 起生效，適用於所有 HORUS-PDM 模組。

### 8.2 變更裁定

- 本文件之變更需經 Architect 明確裁定
- 印章治理紅線變更需法務審核

### 8.3 例外處理

- 本文件不授權任何例外
- 如有特殊需求，需另行建立裁定文件

---

## 九、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立 |

