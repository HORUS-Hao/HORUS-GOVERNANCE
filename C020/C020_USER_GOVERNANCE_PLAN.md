# C020 User Governance Plan (No-OTP, Freeze-safe)

> **Status**: ✅ **IMPLEMENTED** (Phase 2 完成)
> **Baseline**: `c020-v6.7.5-stable` (commit: `ee9b68a`)
> **Implementation**: `feature/c020-user-governance-phase2` branch
> **Date**: 2026-01-15

---

## Phase 0 — PLAN

### Objective

1. 為 C020 建立使用者存取治理機制
2. 不影響既有查詢功能（Filter / Search / Stats / Compare）
3. 不引入 OTP、Token、Session 狀態機
4. 所有新邏輯為「旁掛式（Sidecar）」，不侵入主流程

### Non-Goals（明確排除）

- ❌ **不處理登入流程** — 依賴 Google Login（GAS 內建）
- ❌ **不處理 OTP** — 無 OTP 驗證、無 OTP 發送、無 OTP 儲存
- ❌ **不處理權限升降流程** — 無 VIEWER → ADMIN 升級機制
- ❌ **不影響資料內容** — 治理僅控制「能否看」，不控制「看到什麼」
- ❌ **不引入外部認證服務** — 不使用 Firebase Auth、OAuth Provider 等

### Design Principles

| 原則 | 說明 |
|------|------|
| **Read-only gate** | 治理僅為「閘門」，通過後即為原有 Read-only 功能 |
| **Fail-open** | 治理失敗時（查表錯誤、Sheet 不存在），系統仍可正常使用 |
| **Sidecar only** | 治理邏輯獨立於主流程，不修改既有函數簽章 |
| **Flag controllable** | 單一常數即可開關治理功能 |
| **No state machine** | 不維護 session、不記錄登入狀態、不追蹤使用者行為 |

### User Model（設計，不實作）

```
┌─────────────────────────────────────────────────────────┐
│  C020_USER_ACCESS (Google Sheet or Config)              │
├─────────────────────────────────────────────────────────┤
│  email          │ role      │ status    │ note         │
├─────────────────┼───────────┼───────────┼──────────────┤
│  admin@co.com   │ ADMIN     │ ACTIVE    │ 管理員       │
│  user1@co.com   │ VIEWER    │ ACTIVE    │ 一般使用者   │
│  ex@co.com      │ VIEWER    │ DISABLED  │ 已停用       │
└─────────────────────────────────────────────────────────┘
```

**欄位定義：**
- `email`: Google 帳號 email（唯一鍵）
- `role`: `ADMIN` | `VIEWER`（目前僅區分，功能相同）
- `status`: `ACTIVE` | `DISABLED`
- `note`: 備註（選填）

### Access Decision Flow（流程圖文字版）

```
┌─────────────────────────────────────────────────────────┐
│                    C020 Web App 載入                     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ ENABLE_USER_GOVERNANCE │
              │       == true ?        │
              └────────────────────────┘
                    │            │
                   YES          NO
                    │            │
                    ▼            └──────────────┐
       ┌────────────────────────┐              │
       │ Session.getActiveUser()│              │
       │     .getEmail()        │              │
       └────────────────────────┘              │
                    │                          │
                    ▼                          │
         ┌──────────────────┐                  │
         │  email 有值？    │                  │
         └──────────────────┘                  │
              │         │                      │
             YES       NO                      │
              │         │                      │
              ▼         ▼                      │
    ┌─────────────┐  ┌─────────────────┐       │
    │ 查詢 USER   │  │ Fail-open:      │       │
    │ ACCESS 表   │  │ 視為 VIEWER     │       │
    └─────────────┘  │ 允許存取        │       │
              │      └─────────────────┘       │
              ▼                │               │
    ┌─────────────────┐       │               │
    │ 找到記錄？      │       │               │
    └─────────────────┘       │               │
         │         │          │               │
        YES       NO          │               │
         │         │          │               │
         ▼         ▼          │               │
  ┌───────────┐ ┌─────────────┐               │
  │ status == │ │ Fail-open:  │               │
  │ ACTIVE ?  │ │ 視為 VIEWER │               │
  └───────────┘ │ 允許存取    │               │
      │    │    └─────────────┘               │
     YES  NO          │                       │
      │    │          │                       │
      ▼    ▼          │                       │
┌────────┐ ┌──────────────┐                   │
│ 允許   │ │ 顯示無權限頁 │                   │
│ 存取   │ │ (DISABLED)   │                   │
└────────┘ └──────────────┘                   │
      │                                       │
      └───────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   正常載入 C020 UI     │
              │  （既有功能不變）       │
              └────────────────────────┘
```

**決策規則摘要：**
1. `ENABLE_USER_GOVERNANCE = false` → 直接進入，無治理
2. 無法取得 email → Fail-open，視為 VIEWER，允許存取
3. email 不在名單中 → Fail-open，視為 VIEWER，允許存取（或由 Architect 裁定為拒絕）
4. `status = DISABLED` → 顯示無權限頁面，拒絕存取
5. `status = ACTIVE` → 允許存取

### Rollback Strategy

#### 方式一：Flag 關閉（一行關閉治理）

```javascript
// C020-GetWallmountData.js 或獨立 Config
var ENABLE_USER_GOVERNANCE = false;  // 改為 false 即關閉
```

#### 方式二：Git Tag 回滾（完全回到 Freeze 狀態）

```bash
git checkout c020-v6.7.5-stable
clasp push
clasp deploy
```

#### 方式三：GAS 版本回滾

在 Google Apps Script 編輯器中，選擇部署版本回到 @122（v6.7.5）。

---

## Phase 1 — DESIGN（仍不動主流程）

### 1.1 決策點標註（只標註，不實作）

未來若實作，治理邏輯會掛在以下位置：

```
┌─────────────────────────────────────────────────────────┐
│  C020_Index.html                                        │
├─────────────────────────────────────────────────────────┤
│  window.onload / DOMContentLoaded                       │
│      │                                                  │
│      ├── [NEW] checkUserAccess()  ← 治理檢查點         │
│      │       │                                          │
│      │       └── 通過 → 繼續載入                        │
│      │       └── 拒絕 → 顯示無權限頁                    │
│      │                                                  │
│      └── loadAppInfo()  ← 既有邏輯，不動                │
│      └── initEventListeners()  ← 既有邏輯，不動         │
└─────────────────────────────────────────────────────────┘
```

**不進入的位置：**
- ❌ `api_getAllWallmounts()` — API handler 不包治理
- ❌ `applyFiltersAndRender()` — 篩選邏輯不包治理
- ❌ 任何 try/catch 核心邏輯 — 治理失敗不影響主流程

### 1.2 未來 OTP 接點標註（僅註解，不實作）

若未來導入 OTP，會取代以下層級：

```
目前設計（No-OTP）：
  Session.getActiveUser().getEmail() → 直接使用

未來 OTP 設計（若需要）：
  Session.getActiveUser().getEmail()
      → OTP 驗證層（取代 checkUserAccess）
      → OTP 通過後才允許存取
```

**OTP 接點位置（僅標註）：**
- `checkUserAccess()` 函數可被 `checkUserAccessWithOTP()` 取代
- OTP 驗證 UI 可獨立為 `C020_OTP.html`（不在本階段範圍）

---

## Phase 2 — IMPLEMENT ✅ COMPLETED

> **Phase 2 已於 2026-01-15 完成實作。**

### 2.1 實作檔案

| 檔案 | 用途 |
|------|------|
| `C020_UserAccess.js` | 後端治理模組（Flag + Registry + API） |
| `C020_Index.html` | 前端治理 Gate（v7.0.0） |

### 2.2 治理 Flag

```javascript
// ScriptProperties
C020_USER_GOV_ENABLED = "1" | "0"  // 預設 "0"（關閉）
```

**管理方式：**
```javascript
// 開啟治理
setUserGovernanceEnabled(true);

// 關閉治理
setUserGovernanceEnabled(false);

// 查詢狀態
getGovernanceStatus();
```

### 2.3 User Access Registry

**Sheet Name**: `C020_USER_ACCESS`（位於 T005 主資料表）

| email | role | status | note |
|-------|------|--------|------|
| hao.chang@horus.tw | ADMIN | ACTIVE | 管理員 |
| hao.chang@dapanda.com.tw | ADMIN | ACTIVE | 管理員 |

**欄位說明：**
- `email`: Google 帳號（唯一鍵，不區分大小寫）
- `role`: `ADMIN` / `VIEWER`（目前功能相同）
- `status`: `ACTIVE` / `DISABLED`
- `note`: 備註

### 2.4 API 端點

```javascript
// 取得當前使用者存取設定檔
api_getAccessProfile()
// 回傳 JSON string: { allowed, role, email, reason, govEnabled, timestamp }
```

### 2.5 前端治理 Gate

```javascript
// window.onload 流程
checkAccessAndInit()
  → api_getAccessProfile()
  → profile.allowed === false → showAccessDenied()
  → profile.allowed === true  → initializeApp()
```

### 2.6 Fail-open 行為

| 情境 | 結果 |
|------|------|
| `C020_USER_GOV_ENABLED = "0"` | 直接放行，不檢查 |
| 無法取得 email | 放行（視為 VIEWER） |
| email 不在 Registry | 放行（視為 VIEWER） |
| API 呼叫失敗 | 放行（繼續載入） |
| JSON parse 失敗 | 放行（繼續載入） |
| `status = DISABLED` | **拒絕**（顯示無權限頁） |

---

## 交付驗收條件

| 條件 | 狀態 |
|------|------|
| C020 現有功能完全不變 | ✅ 治理為 Sidecar，不侵入主流程 |
| 治理預設關閉 | ✅ `C020_USER_GOV_ENABLED` 預設 "0" |
| Fail-open 機制 | ✅ 任何錯誤都會放行 |
| 明確 rollback 與 disable 機制 | ✅ 見 Rollback Strategy |
| 無權限頁面 | ✅ 已實作 |

---

## Appendix A: Architect 裁定結果

| 項目 | 裁定結果 |
|------|----------|
| 未註冊 email 的處理 | ✅ Fail-open（允許） |
| USER_ACCESS 儲存位置 | ✅ Google Sheet（`C020_USER_ACCESS`） |
| ADMIN 與 VIEWER 功能差異 | ✅ 相同（僅標記角色） |
| 無權限頁面文案 | ✅「存取受限」+「您的帳號目前無法存取此系統」 |

---

## Appendix B: Architect 裁定原則（2026-01-15 Phase 2）

> **本節為 Governance Fact，不可由程式邏輯推翻。**

### B.1 核心原則

1. **User Access Registry 為 Governance Fact，不由程式建立**
   - `C020_USER_ACCESS` Sheet 必須由 Architect 手動建立
   - 程式不得自動建立、初始化或修改該 Sheet

2. **程式僅為 Reader，非 Authority**
   - 程式碼僅能 Read-only 存取 Registry
   - 不得出現任何寫入操作（setValues, appendRow, insertSheet 等）

3. **任何未註冊使用者視為 VIEWER（Fail-open）**
   - 查無 email → 允許存取
   - Sheet 不存在 → 允許存取
   - API 錯誤 → 允許存取

4. **唯一拒絕條件為 status=DISABLED**
   - 僅當明確找到使用者且 status=DISABLED 時才拒絕
   - 其他所有情況一律放行

### B.2 禁止事項（Prohibited）

| 禁止項目 | 說明 |
|----------|------|
| ❌ Installer script | 不得建立任何自動安裝腳本 |
| ❌ 首次啟動自動建表 | 不得在首次載入時建立 Sheet |
| ❌ 隱性初始化行為 | 不得有任何隱藏的資料建立邏輯 |
| ❌ 因治理導致功能不可用 | 治理失敗不得影響核心功能 |

### B.3 程式碼限制

**C020_UserAccess.js 允許的操作：**
```javascript
SpreadsheetApp.openById(...)      // ✅ 允許
sheet.getDataRange().getValues()  // ✅ 允許
```

**C020_UserAccess.js 禁止的操作：**
```javascript
SpreadsheetApp.create(...)        // ❌ 禁止
ss.insertSheet(...)               // ❌ 禁止
sheet.setValues(...)              // ❌ 禁止
sheet.appendRow(...)              // ❌ 禁止
range.setValue(...)               // ❌ 禁止
```

### B.4 程式碼驗證結果

```
$ grep -E "create\(|insertSheet|setValues|appendRow" C020_UserAccess.js
(no matches found) ✅
```

### B.5 Rollback 保證

- `C020_USER_GOV_ENABLED = "0"` → 100% 關閉治理，回到 v6.7.5 行為
- Git tag `c020-v6.7.5-stable` → 完整回滾點
- GAS deployment @122 → v6.7.5 部署版本

---

**END OF C020_USER_GOVERNANCE_PLAN.md**
