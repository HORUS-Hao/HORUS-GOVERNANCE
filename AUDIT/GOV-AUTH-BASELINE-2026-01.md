# S005 / V005 權限架構 Baseline

**Baseline Date**: 2026-01-09
**Audit Source**: Code.gs Runtime Analysis
**Status**: Authoritative Record

---

## 一句話總結

> **Internal / External 判斷為 Hard Code Domain，不查任何表。**

---

## 權限架構速查表

### 1. 身分判斷（Internal / External）

| 項目 | 值 |
|------|-----|
| 判斷方式 | **Hard Code Domain**（程式碼內建） |
| 判斷函數 | `isInternalUser_(email)` |
| Internal 網域 | `@horus.tw`, `@dapanda.com.tw` |
| External | 其他所有網域 |
| 資料表依賴 | **無**（不查任何表） |

### 2. 權限資料表分工

| 資料表 | 用途 | 檢查時機 |
|--------|------|----------|
| **User_Company_Permission** | 可代表哪些公司建立報價 | S005 建立報價時 |
| **USERS_ACCESS** | 角色權限（僅 APPROVER 生效） | V005 審核時 |
| **Admin_Users** | 登入驗證（Email + PIN） | 登入時 |
| **Admin_Sessions** | OTP Session | OTP 驗證時 |
| **Company_Profile** | 公司資料、印章 | 報價 / 核准時 |

### 3. 審核操作流程

```
審核操作（核准/駁回）
    │
    ├─ isInternalUser_(email) ← Hard Code（不查表）
    │   └─ External → 403 EXTERNAL_FORBIDDEN
    │
    └─ Internal
        └─ USERS_ACCESS.role === 'APPROVER' → 允許
```

### 4. 目前未生效設計

| 項目 | 狀態 |
|------|------|
| `User_Company_Permission.role` | 讀取但未使用 |
| `USERS_ACCESS.role = VIEWER` | 定義存在，無檢查 |
| `USERS_ACCESS.role = CREATOR` | 定義存在，無檢查 |
| `USERS_ACCESS.role = ISSUER` | 定義存在，無檢查 |
| `seal_file_id` | LEGACY，已被 `stamp_file_id` 取代 |

### 5. 印章治理裁定

| 裁定項目 | 規則 |
|----------|------|
| Runtime 識別 | 僅依賴 `stamp_file_id`（Drive File ID） |
| 檔名依賴 | **禁止** — 任何程式邏輯不得依賴印章檔名 |
| 路徑依賴 | **禁止** — 任何程式邏輯不得依賴印章資料夾路徑 |
| 重新命名 | ✅ 允許（File ID 不變即可） |
| 移動位置 | ✅ 允許（File ID 不變即可） |
| 治理資料夾 | `HORUS-GOVERNANCE/ASSETS/STAMPS/` — 僅供人工管理，非系統依賴 |

### 6. Stamp_Registry（v0 新增）

**v0 狀態**：Company Stamp Only Runtime

| 項目 | 狀態 | 說明 |
|------|------|------|
| Stamp_Registry 表 | ✅ 上線 | 唯一 Runtime Source |
| COMPANY stamp | ✅ 支援 | 從 Company_Profile 同步 |
| PERSONAL stamp | ⏸ 預留 | Internal only，未啟用 UI |
| External + PERSONAL | ❌ Hard Gate | `EXTERNAL_FORBIDDEN` |
| UI 切換 | ❌ 不提供 | v0 固定 `stampType = 'COMPANY'` |

**Runtime 解析**：

```
resolveStampFileId_(context)
    │
    ├─ stampType === 'PERSONAL'
    │   └─ isInternalUser_() → false → throw EXTERNAL_FORBIDDEN
    │
    └─ 查詢 Stamp_Registry
        └─ status === 'ACTIVE' + 符合條件 → 回傳 stamp_file_id
```

**回滾方式**：停用 StampRegistry.gs，恢復使用 `Company_Profile.stamp_file_id`

---

## 相關文件索引

| 文件 | 路徑 | 說明 |
|------|------|------|
| Runtime Auth Flow | `HORUS-GOVERNANCE/AUDIT/RUNTIME-AUTH-FLOW.md` | 完整權限流程分析 |
| Sheet Usage Map | `HORUS-GOVERNANCE/AUDIT/SHEET-RUNTIME-USAGE-MAP.md` | Sheet 使用狀態 |
| Gov Doc Mismatch | `HORUS-GOVERNANCE/AUDIT/GOV-DOC-MISMATCH.md` | 文件落差清單 |
| Future Candidates | `HORUS-GOVERNANCE/AUDIT/FUTURE-AUTH-REFORM-CANDIDATES.md` | 未來改善候選 |
| 操作使用手冊 | `HORUS-GOVERNANCE/MANUALS/S005_V005_操作使用手冊.md` | 使用者操作手冊 |
| 測試驗證模板 | `HORUS-GOVERNANCE/TESTING/TEST-USER-VALIDATION-2026-01-09.md` | 使用者驗證測試 |

---

## 變更記錄

| 日期 | 說明 |
|------|------|
| 2026-01-09 | 初版建立，經 Code Audit 驗證 |
| 2026-01-09 | 新增 Section 6: Stamp_Registry v0 |

---

*此文件為權限架構的單一真實來源（Baseline），如有疑問以此文件為準。*
