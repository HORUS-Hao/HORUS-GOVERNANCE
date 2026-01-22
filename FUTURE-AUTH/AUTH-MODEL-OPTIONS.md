# 權限模型設計方案選項

**文件代號**：AUTH-MODEL-OPTIONS
**建立日期**：2026-01-09
**模式**：Design-only（僅列方案選項，不含實作）

---

## 文件目的

針對 FUTURE-AUTH-USE-CASES.md 列出的情境，提供設計方案選項供 Architect 評估。

**聲明**：本文件僅提供方案比較，不做決策、不含程式碼。

---

## 評估維度說明

| 維度 | 說明 |
|------|------|
| 破壞既有資料 | 是否需要遷移或修改現有 Sheet 資料 |
| 影響 External Hard Gate | 是否會改變 Domain Hard Code 判斷邏輯 |
| 複雜度 | Low / Medium / High |
| 適合現在做 | Yes（簡單可控）/ No（風險或工程量大） |

---

## A1. 金額門檻審核

### Option A：新增 Approval_Rules 表

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否（新增表，不改既有） |
| 影響 External Hard Gate | 否 |
| 複雜度 | Medium |
| 適合現在做 | No（需定義門檻規則引擎） |

**概念**：建立規則表，定義金額區間與對應審核層級。

### Option B：Company_Profile 新增欄位

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否（新增欄位） |
| 影響 External Hard Gate | 否 |
| 複雜度 | Low |
| 適合現在做 | No（需定義每家公司門檻） |

**概念**：在 Company_Profile 加入 `approval_threshold` 欄位。

---

## A2. 多層審核流程

### Option A：Workflow 狀態機

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 是（狀態機可能不相容） |
| 影響 External Hard Gate | 否 |
| 複雜度 | High |
| 適合現在做 | No（需重構狀態機） |

**概念**：重新設計 Quote Status 為多階段 Workflow。

### Option B：Approval_History 表

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否（新增表） |
| 影響 External Hard Gate | 否 |
| 複雜度 | Medium |
| 適合現在做 | No（需配合 UI 改動） |

**概念**：記錄每層審核歷程，累計達標後才真正核准。

---

## A3. 指定審核人

### Option A：Quote 表新增 assigned_approver 欄位

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否（新增欄位） |
| 影響 External Hard Gate | 否 |
| 複雜度 | Low |
| 適合現在做 | No（需 UI 支援指定功能） |

**概念**：建立報價時可選擇審核人，僅該人可操作。

### Option B：沿用 Company_Profile.supervisor_emails

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否 |
| 影響 External Hard Gate | 否 |
| 複雜度 | Low |
| 適合現在做 | No（需確認 supervisor_emails 用途） |

**概念**：利用現有欄位限制審核人範圍。

---

## B1. 公司專屬 APPROVER

### Option A：User_Company_Permission.role 生效

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否（欄位已存在） |
| 影響 External Hard Gate | 否 |
| 複雜度 | Low |
| 適合現在做 | No（需評估影響範圍） |

**概念**：讓 User_Company_Permission.role 實際參與審核判斷。

### Option B：新增 Company_Approvers 表

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否（新增表） |
| 影響 External Hard Gate | 否 |
| 複雜度 | Medium |
| 適合現在做 | No（需新增管理介面） |

**概念**：獨立維護每家公司的審核人清單。

---

## C1-C3. VIEWER / CREATOR / ISSUER 角色生效

### Option A：checkPermission() 擴展

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否 |
| 影響 External Hard Gate | 否 |
| 複雜度 | Medium |
| 適合現在做 | No（需定義各角色權限矩陣） |

**概念**：在既有 checkPermission() 加入角色判斷分支。

### Option B：Permission Matrix 表

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否（新增表） |
| 影響 External Hard Gate | 否 |
| 複雜度 | High |
| 適合現在做 | No（需設計權限矩陣結構） |

**概念**：建立「角色 × 操作」矩陣表，集中管理。

---

## C4. 角色組合

### Option A：USERS_ACCESS 多行記錄

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 是（一人多行可能衝突） |
| 影響 External Hard Gate | 否 |
| 複雜度 | Medium |
| 適合現在做 | No（需處理多行合併邏輯） |

**概念**：同一 email 可有多筆角色記錄，合併生效。

### Option B：roles 欄位（JSON Array）

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 是（欄位格式改變） |
| 影響 External Hard Gate | 否 |
| 複雜度 | Medium |
| 適合現在做 | No（需遷移既有資料） |

**概念**：roles 欄位改為 JSON Array 格式。

---

## D1. External 有限審核權

### Option A：修改 Hard Gate 加入例外

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否 |
| 影響 External Hard Gate | **是**（核心變更） |
| 複雜度 | High |
| 適合現在做 | **No**（高風險） |

**概念**：在 isInternalUser_() 後加入例外條件判斷。

### Option B：維持 Hard Gate，另開 Limited Approval API

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否 |
| 影響 External Hard Gate | 否（Hard Gate 維持） |
| 複雜度 | High |
| 適合現在做 | No（需新 API 與審計） |

**概念**：Hard Gate 不動，開放另一個有限功能的 API。

---

## D2. External 查看範圍限制

### Option A：Query Filter 加入 created_by

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否 |
| 影響 External Hard Gate | 否 |
| 複雜度 | Low |
| 適合現在做 | No（需確認現有查詢邏輯） |

**概念**：External 查詢時自動加入 created_by = currentUser。

### Option B：User_Company_Permission 查詢限制

| 維度 | 評估 |
|------|------|
| 破壞既有資料 | 否 |
| 影響 External Hard Gate | 否 |
| 複雜度 | Low |
| 適合現在做 | No（需確認授權粒度） |

**概念**：依據 User_Company_Permission 過濾可見報價單。

---

## 方案風險總覽

| 情境 | 推薦方案 | 風險等級 | 備註 |
|------|----------|----------|------|
| A1 金額門檻 | Option B | Low | 新增欄位即可 |
| A2 多層審核 | Option B | Medium | 不動狀態機 |
| A3 指定審核人 | Option A | Low | 新增欄位 |
| B1 公司專屬 APPROVER | Option A | Low | 活用既有欄位 |
| C1-C3 角色生效 | Option A | Medium | 漸進擴展 |
| C4 角色組合 | Option A | Medium | 多行記錄 |
| D1 External 有限審核 | **高風險** | High | 不建議現階段 |
| D2 External 查看限制 | Option A | Low | Query Filter |

---

*此文件為設計選項參考，不構成實作承諾。實作需經 Architect 裁定後啟動新 Phase。*
