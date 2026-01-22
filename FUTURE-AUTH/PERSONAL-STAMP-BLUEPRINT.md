# FUTURE BLUEPRINT：個人章（Personal Stamp）升級設計

**文件代號**：PERSONAL-STAMP-BLUEPRINT
**建立日期**：2026-01-09
**狀態**：設計完成｜未啟用｜不影響現行功能

---

## 0. 現況基線（不可破壞）

### 已確認 Runtime 行為

| 項目 | 現況 |
|------|------|
| 唯一生效印章來源 | `Company_Profile.stamp_file_id` |
| 僅支援 | 公司章（Company Stamp） |
| 完全不支援 | 個人章、依檔名/資料夾推導印章 |

**本藍圖不得影響上述現況。**

---

## 1. 升級目標（Future Goal）

未來支援下列能力：

### 1.1 同一公司
- 預設使用「公司章」
- 可選擇使用「個人章」（如：業務負責人章）

### 1.2 同一使用者
- 可持有多個個人章

### 1.3 報價單層級
- 可明確記錄「實際使用哪一顆章」

---

## 2. 資料模型擴充（僅新增，不修改既有）

### 2.1 新增資料表：Stamp_Registry（核心）

| 欄位 | 說明 |
|------|------|
| `stamp_id` | 系統內唯一 ID（UUID） |
| `stamp_type` | `COMPANY` / `PERSONAL` |
| `company_code` | 所屬公司（PERSONAL 仍需歸屬公司） |
| `owner_email` | 個人章擁有者（COMPANY 為空） |
| `stamp_file_id` | 唯一 Runtime 識別（Drive File ID） |
| `status` | `ACTIVE` / `DISABLED` |
| `created_at` | 建立時間 |

### 2.2 裁定

- 未來所有印章一律以 `stamp_file_id` 為唯一技術識別
- `Company_Profile.stamp_file_id` 保留作為「預設公司章」

---

## 3. Quote 層級的實際使用紀錄（關鍵）

### 3.1 Quote Snapshot 新增欄位（未來）

| 欄位 | 說明 |
|------|------|
| `applied_stamp_id` | 實際使用的 stamp_id |
| `applied_stamp_type` | `COMPANY` / `PERSONAL` |
| `applied_stamp_file_id` | 實際輸出的 file_id（快照） |

### 3.2 原則

- 一旦報價單核准，印章快照不可變
- 即使未來章被停用，也不影響已核准文件

---

## 4. Runtime 流程（未來版，不現在做）

### 4.1 印章選擇優先順序

```
IF quote.applied_stamp_id EXISTS
  → 使用該 stamp
ELSE
  → fallback 使用 Company_Profile.stamp_file_id
```

### 4.2 權限 Gate（強制）

**PERSONAL Stamp 使用條件：**

| 條件 | 檢查 |
|------|------|
| 擁有者驗證 | `stamp.owner_email === current_user` |
| 公司歸屬 | `user.company_code === stamp.company_code` |
| 狀態有效 | `stamp.status === ACTIVE` |

**External 使用者：禁止使用個人章（Hard Gate）**

---

## 5. UI 層（未來，不現在做）

### 5.1 V005（Internal only）

顯示選項：
- 「使用公司章（預設）」
- 「使用個人章（若有）」

### 5.2 External 使用者

- UI 不顯示
- Server 強制拒絕

---

## 6. 資料夾治理（現在可先做，不影響）

### 建議結構（治理用）

```
STAMPS/
├─ COMPANY/
│  ├─ HORUS/
│  ├─ DAPANDA/
│  └─ MAAI/
└─ PERSONAL/
   ├─ hao.chang/
   └─ others/
```

### 裁定

- Runtime 永遠不依賴資料夾
- 僅治理、人類辨識用途

---

## 7. 啟用前檢查清單（Future Gate）

啟用「個人章」前，必須全部完成：

| # | 項目 | 狀態 |
|---|------|------|
| 1 | Stamp_Registry 上線 | ⏸ 未完成 |
| 2 | Quote Snapshot 欄位存在 | ⏸ 未完成 |
| 3 | Server Gate（External / 權限）完成 | ⏸ 未完成 |
| 4 | Audit Log 記錄 stamp_id | ⏸ 未完成 |
| 5 | Governance 文件更新完成 | ⏸ 未完成 |

**任一未完成 = 不得啟用**

---

## 8. Architect 裁定語

> **個人章為未來擴充功能，必須以獨立 Registry 管理，並以 stamp_file_id 為唯一識別；未完成完整 Snapshot 與 Gate 前，不得進入 Runtime。**

---

## 變更記錄

| 日期 | 說明 |
|------|------|
| 2026-01-09 | 初版建立，設計完成但未啟用 |

---

*此文件為未來藍圖，不構成當前實作承諾。啟用需經 Architect 裁定並完成所有 Gate 檢查。*
