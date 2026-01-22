# C005 Governance Alignment Audit

- **Audit Date**: 2026-01-22
- **Mode**: Read-only Alignment Audit
- **Inputs**:
  - `C005-READONLY-AUDIT-2026-01-22.md`
  - `HORUS-GOVERNANCE/`
  - `HORUS-FACTS/`

---

## 1. 分層一致性檢查（FACT / DERIVED / GOVERNANCE）

### 1.1 一致項目 ✅

| 項目 | Blind Audit 結論 | 治理文件定義 | 來源 |
|------|------------------|--------------|------|
| C005 Layer 定位 | DERIVED | **DERIVED** | `V005/MODULE-REGISTRY/C005.md` Line 17 |
| T005 Layer 定位 | FACT | **FACT** | `V005/MODULE-REGISTRY/T005.md` Line 16 |
| C005 對 T005 唯讀 | Read-only | **Read Only** | `V005/MODULE-REGISTRY/T005.md` Access Control, Line 60 |
| T005 唯一寫入者 | D005 | **僅 D005 可寫入** | `V005/MODULE-REGISTRY/T005.md` Line 49 |

### 1.2 不一致項目 ⚠️

| 項目 | Blind Audit 發現 | 治理文件定義 | 衝突描述 |
|------|------------------|--------------|----------|
| T005 Schema 欄位數 | 24 欄（Utils.js 硬編碼） | T005_DATA_CONTRACT_v1.0: 29 欄（已標註 DEPRECATED） | **DATA_CONTRACT 已過期**，與 `HORUS-FACTS/T005/T005_SHEET_SCHEMA_CANONICAL.md` (24 欄) 一致 |
| C005 Schema 契約 | 程式碼存在完整實作 | `DATA_CONTRACTS/C005/C005_DATA_CONTRACT_v1.0.md` 為空檔案 | **治理文件缺失**，契約未定義 |

### 1.3 未定義項目 ❓

| 項目 | Blind Audit 發現 | 治理現狀 |
|------|------------------|----------|
| `SYNC_T005_SALES_COMPANY.js` 寫入權限 | 存在越界寫入 T005_SALES_COMPANY | **無治理文件規範** |
| `ExternalCanonical.js` 角色定義 | OWNER/ADMIN/INTERNAL/VIEWER | **無治理文件對照** |
| `HistoryManager.js` 寫入權限 | 可寫入 HISTORY_SHEET | **無治理文件規範** |
| D001 Integration Fallback | 存在且實作中 | **無治理文件規範** |

---

## 2. 模組責任邊界對照（C005 / T005 / T002 / C020）

### 2.1 符合治理定義 ✅

| 責任項目 | C005 實際行為 | 治理規範 | 來源 |
|---------|---------------|----------|------|
| T005 讀取權限 | `Utils.js/readT005Data()` 唯讀 | C005 = Read Only | `V005/MODULE-REGISTRY/T005.md` Line 60 |
| 禁止寫入 FACT | `Utils.js` 不執行 T005 寫入 | 僅讀取 FACT | `V005/MODULE-REGISTRY/C005.md` Line 32 |
| 禁止補齊資料 | 比對引擎不自動填補 | 禁止補齊 | `V005/MODULE-REGISTRY/C005.md` Line 33 |

### 2.2 偏離治理定義 ⚠️

| 責任項目 | C005 實際行為 | 治理規範 | 偏離說明 |
|---------|---------------|----------|----------|
| T005_SALES_COMPANY 寫入 | `SYNC_T005_SALES_COMPANY.js` 執行寫入 | C005 不得寫入任何 FACT 資料 | **明確違反** `C005.md` Line 32 |
| 寫入 History Sheet | `HistoryManager.js` 寫入比對歷史 | **未定義** | 寫入 DERIVED 資料，治理未明確規範 |
| 寫入 Google Drive | `ExportUtils.js` 匯出 Excel | **未定義** | 匯出行為治理未明確規範 |

---

## 3. 越界與寫入權限對照

### 3.1 已被治理文件允許 ✅

| 項目 | 治理來源 | 描述 |
|------|----------|------|
| C005 讀取 T005 | `T005.md` Access Control | `C005 | Read Only | 上架比對` |
| C005 讀取 UID, 商品型號 | `T005_DATA_CONTRACT_v1.0.md` Section 7.4 | `C005 | UID, 商品型號 | Index-based` |

### 3.2 程式存在但治理未宣告 ⚠️

| 檔案 | 行為 | 治理狀態 | 證據位置 |
|------|------|----------|----------|
| `SYNC_T005_SALES_COMPANY.js` | 寫入 T005_SALES_COMPANY Sheet | **未宣告** | `refreshT005SalesCompanySeed()` |
| `HistoryManager.js` | 建立/刪除 History Sheet 工作表 | **未宣告** | `saveComparisonHistory()`, `deleteComparisonHistory()` |
| `ExportUtils.js` | 寫入 Google Drive（匯出 Excel） | **未宣告** | `createExcelBlob()` |
| `Code.js` | 暴露 `diag_*` 診斷 RPC | **未宣告** | Lines 690-1092 |
| `ExternalCanonical.js` | 定義 USER_ROLES 權限模型 | **未宣告** | `OWNER/ADMIN/INTERNAL/VIEWER` |
| `D001-Integration.js` | D001 Data Hub 整合 + Fallback | **未宣告** | `D001Service.getProducts()` |

### 3.3 需新增裁定項目 🔴

| 項目 | 裁定類型 | 說明 |
|------|----------|------|
| `SYNC_T005_SALES_COMPANY.js` 歸屬 | ADR | 確認是否遷移至 T005 模組或獨立服務 |
| C005 History 寫入權限 | Governance Rule | 確認 DERIVED 資料寫入是否合法 |
| C005 Export 寫入權限 | Governance Rule | 確認 Google Drive 寫入是否合法 |
| `diag_*` 函數暴露 | Security Policy | 確認診斷函數是否應移除或加權限 |
| USER_ROLES 定義 | Canonical Registration | 確認是否納入 GOVERNANCE 管理 |

---

## 4. Phase / Freeze 對照結果

### 4.1 可直接 Freeze ✅

| 模組 | 依據 | 說明 |
|------|------|------|
| `Config.js` | 無治理衝突 | SSOT 配置已穩定，符合 `GOVERNANCE-PRINCIPLES.md` |
| `ExternalCanonical.js` | 無治理衝突 | 欄位/角色定義已穩定 |
| `ERPProcessor.js` | 無治理衝突 | 純 DERIVED 計算，無 FACT 存取 |
| `PlatformProcessor.js` | 無治理衝突 | 純 DERIVED 計算，無 FACT 存取 |
| `ComparisonEngine.js` | 符合 `C005.md` Line 34 | 比對邏輯凍結需 Architect 核准 |

### 4.2 需補條件後 Freeze ⚠️

| 模組 | 條件 | 說明 |
|------|------|------|
| `Utils.js` | 加入 T005 Schema runtime 驗證 | 目前硬編碼 24 欄索引，需防禦性驗證 |
| `Code.js` | 移除/保護 `diag_*` 函數 | RPC 暴露診斷函數有資訊洩漏風險 |
| `HistoryManager.js` | 治理文件補齊寫入權限定義 | 目前無治理規範其 DERIVED 寫入 |
| `ExportUtils.js` | 治理文件補齊寫入權限定義 | 目前無治理規範 Google Drive 匯出 |

### 4.3 不可 Freeze（需裁定）🔴

| 模組 | 原因 | 裁定需求 |
|------|------|----------|
| `SYNC_T005_SALES_COMPANY.js` | 明確違反 `C005.md` Line 32 | 需 ADR 決定歸屬與處置方式 |
| `D001-Integration.js` | 外部依賴未治理 | 需確認 D001 治理狀態與 fallback 策略 |

---

## 5. 治理缺口（Governance Gaps）

### 5.1 文件缺口 📄

| 缺口 | 現狀 | 應有 |
|------|------|------|
| `DATA_CONTRACTS/C005/C005_DATA_CONTRACT_v1.0.md` | 空檔案 | 完整 C005 資料契約 |
| C005 History Sheet Schema | 存在於 `HORUS-FACTS/C005/` 但未被 C005.md 引用 | 交叉參照 |
| C005 寫入權限清單 | 無 | 明確列舉 C005 可寫入的 Sheet |
| D001 Integration 治理 | 無 | D001 模組註冊與整合規範 |

### 5.2 規則缺口 📋

| 缺口 | 說明 |
|------|------|
| DERIVED 層寫入規則 | `C005.md` 僅規定「不得寫入 FACT」，但未規範 DERIVED 寫入權限 |
| RPC 暴露函數白名單 | 無治理規範哪些函數可暴露為 RPC |
| Schema 變更通知機制 | `T005_SHEET_SCHEMA_CANONICAL.md` Section 6 有規範，但 C005 未被列為 Consumer |

### 5.3 決策缺口 ⚖️

| 缺口 | 說明 |
|------|------|
| `SYNC_T005_SALES_COMPANY.js` 定位 | 該檔案屬於 C005 但寫入 T005 相關資料，需 ADR 裁定歸屬 |
| UI 凍結範圍 | `C005.md` Line 35 提及「UI 凍結」，但未明確定義 UI 範圍 |
| Phase B 對 C005 的約束 | `ADR-0001` 規範 T005/MCP，但 C005 讀取 T005 是否受影響未明確 |

---

## 6. 裁定建議（非實作）

### 6.1 建議新增 ADR

| ADR 編號建議 | 主題 | 說明 |
|-------------|------|------|
| ADR-0002 | C005 SYNC 模組歸屬裁定 | 決定 `SYNC_T005_SALES_COMPANY.js` 是否遷移至 T005 或獨立服務 |
| ADR-0003 | C005 DERIVED 寫入權限 | 明確規範 C005 可寫入的 DERIVED 資料範圍 |

### 6.2 建議封存 / 遷移模組

| 模組 | 建議行動 | 理由 |
|------|----------|------|
| `SYNC_T005_SALES_COMPANY.js` | 遷移至 T005 模組或獨立 SYNC 服務 | 違反 C005 唯讀原則 |
| `D001-Integration.js` | 評估是否遷移至 D001 模組 | 整合層應由 D001 自行管理 |

### 6.3 建議後續 Audit 順序

| 順序 | 模組 | 理由 |
|------|------|------|
| 1 | D001 | 確認 D001 治理狀態，影響 C005 整合策略 |
| 2 | T005 | 確認 T005_SALES_COMPANY 的治理歸屬 |
| 3 | Observer-Mail | 確認與 C005 History 的資料流關係 |

---

## 附錄 A: 治理文件交叉參照

| Blind Audit 引用 | 對應治理文件 | 狀態 |
|------------------|--------------|------|
| C005 Layer = DERIVED | `V005/MODULE-REGISTRY/C005.md` Line 17 | ✅ 一致 |
| T005 Layer = FACT | `V005/MODULE-REGISTRY/T005.md` Line 16 | ✅ 一致 |
| C005 唯讀 T005 | `V005/MODULE-REGISTRY/T005.md` Line 60 | ✅ 一致 |
| T005 24 欄 Schema | `HORUS-FACTS/T005/T005_SHEET_SCHEMA_CANONICAL.md` | ✅ 一致 |
| T005 Data Contract | `DATA_CONTRACTS/T005/T005_DATA_CONTRACT_v1.0.md` | ⚠️ DEPRECATED |
| C005 Data Contract | `DATA_CONTRACTS/C005/C005_DATA_CONTRACT_v1.0.md` | ❌ 空檔案 |
| C005 History Schema | `HORUS-FACTS/C005/C005_LISTING_HISTORY_SCHEMA.md` | ✅ 存在 |

---

## 附錄 B: 程式碼證據索引

| 發現項目 | 檔案 | 位置 |
|---------|------|------|
| T005 24 欄硬編碼 | Utils.js | Lines 82-101 |
| SYNC 越界寫入 | SYNC_T005_SALES_COMPANY.js | `refreshT005SalesCompanySeed()` |
| History 寫入 | HistoryManager.js | `saveComparisonHistory()` |
| Export 寫入 | ExportUtils.js | `createExcelBlob()` |
| diag_* RPC 暴露 | Code.js | Lines 690-1092 |
| USER_ROLES 定義 | ExternalCanonical.js | `USER_ROLES` constant |
| D001 Fallback | D001-Integration.js | `D001Service.getProducts()` |

---

**本文件為 Alignment Audit 產出，所有結論皆可追溯至程式碼或治理文件路徑。**
**不包含最終裁定，僅提供可供裁定之事實與衝突點。**
