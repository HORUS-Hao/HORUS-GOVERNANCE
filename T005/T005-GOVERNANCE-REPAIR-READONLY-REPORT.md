# T005 Governance Repair - Read-Only Report

> **Report Date**: 2026-01-23
> **Report Type**: READ-ONLY Governance Audit
> **Scope**: HORUS-GOVERNANCE / HORUS-FACTS / HORUS-DERIVED
> **Status**: FROZEN (可作為交接/凍結依據)

---

## Task 1｜Canonical Schema 定錨檢查

### 1.1 所有宣告 T005 Schema 的治理文件清單

| # | 文件路徑 | 宣告欄位數 | 文件狀態 | 與「24 欄 Canonical」一致 |
|---|---------|-----------|----------|--------------------------|
| 1 | `HORUS-GOVERNANCE/T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` | **24 欄** (21 業務 + 3 系統) | **ACTIVE** | ✅ 一致（定錨文件） |
| 2 | `HORUS-FACTS/T005/T005_SHEET_SCHEMA_CANONICAL.md` | **24 欄** (21 業務 + Col 22-24) | **SSOT** | ✅ 一致 |
| 3 | `HORUS-GOVERNANCE/DATA_CONTRACTS/T005/T005_DATA_CONTRACT_v1.0.md` | **29 欄** | **DEPRECATED** | ❌ 不一致（已標廢棄） |
| 4 | `HORUS-GOVERNANCE/V005/MODULE-REGISTRY/T005.md` | **8 欄** (僅示意) | **ACTIVE** | ❌ 不一致（過時簡化版） |
| 5 | `HORUS-GOVERNANCE/T005/AUDIT/T005-READONLY-AUDIT-2026-01-22.md` | 記錄 **28 欄**（Main.gs） | **AUDIT** | ⚠️ 稽核發現（非宣告） |
| 6 | `HORUS-GOVERNANCE/T005/AUDIT/T005-GOVERNANCE-ALIGNMENT-AUDIT-2026-01-22.md` | 比對 24 vs 28 | **AUDIT** | ⚠️ 稽核發現（非宣告） |
| 7 | `HORUS-GOVERNANCE/C005/C005-T005-SCHEMA-ADAPTER.md` | 引用 Canonical | **EFFECTIVE** | ✅ 一致（引用定錨） |
| 8 | `HORUS-GOVERNANCE/C005/C005-T005-Field-Governance.md` | 引用 24 欄 | **EFFECTIVE** | ✅ 一致（引用定錨） |

### 1.2 欄位數宣告彙整

| 宣告欄位數 | 文件數 | 狀態分布 |
|-----------|-------|---------|
| **24 欄** | 4 | ACTIVE/SSOT/EFFECTIVE |
| **29 欄** | 1 | DEPRECATED |
| **28 欄** | 2 | AUDIT (稽核發現) |
| **8 欄** | 1 | ACTIVE (過時簡化) |

### 1.3 Task 1 結論

- **定錨文件**：`T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` (24 欄)
- **SSOT 同步**：`HORUS-FACTS/T005/T005_SHEET_SCHEMA_CANONICAL.md` 與定錨一致
- **不一致項**：
  - `V005/MODULE-REGISTRY/T005.md` 僅列 8 欄（過時）
  - `DATA_CONTRACTS/T005/T005_DATA_CONTRACT_v1.0.md` 列 29 欄（已 DEPRECATED）
  - AUDIT 文件記錄 Main.gs 硬編碼 28 欄（程式碼事實）

---

## Task 2｜MODULE-REGISTRY 信任度檢查

### 2.1 檢查對象

**文件**：`HORUS-GOVERNANCE/V005/MODULE-REGISTRY/T005.md`

### 2.2 比對結果

| 項目 | MODULE-REGISTRY 宣告 | Canonical Schema 定義 | 狀態 |
|------|---------------------|---------------------|------|
| 欄位數 | 8 欄 | 24 欄 | ❌ 不符 |
| 欄位名稱 | sku, name, brand, category, cost, price, status, updated_at | UID, 供應商, PM, 品牌, 商品型號... | ❌ 不符 |
| 主鍵名稱 | `sku` | `UID` | ❌ 不符 |

### 2.3 MODULE-REGISTRY Schema 內容

```markdown
| Column | Type | Description | Governance |
|--------|------|-------------|------------|
| sku | String | 商品編號 (Primary Key) | 不可變更 |
| name | String | 商品名稱 | D005 寫入 |
| brand | String | 品牌 | D005 寫入 |
| category | String | 分類 | D005 寫入 |
| cost | Number | 成本 | D005 寫入 |
| price | Number | 售價 | D005 寫入 |
| status | String | 狀態 | D005 寫入 |
| updated_at | DateTime | 更新時間 | 自動填入 |
```

### 2.4 治理誤導風險判定

| 風險項目 | 判定 | 原因 |
|---------|------|------|
| 構成治理誤導風險 | **YES** | MODULE-REGISTRY 是模組查詢入口，新讀者會誤以為 T005 只有 8 欄 |
| 主鍵名稱錯誤 | **YES** | 宣告 `sku`，實際為 `UID`，可能導致程式碼錯誤引用 |
| 欄位數落差過大 | **YES** | 8 欄 vs 24 欄，落差 16 欄 |

### 2.5 Task 2 結論

- **風險等級**：🔴 高
- **問題性質**：MODULE-REGISTRY 內容嚴重過時，與 Canonical Schema 完全不符
- **影響範圍**：新進人員或系統可能基於錯誤資訊開發

---

## Task 3｜寫入權限「宣告 vs 現實」對照

### 3.1 文件面：宣告「D005 為唯一寫入者」的文件

| # | 文件路徑 | 宣告內容 |
|---|---------|---------|
| 1 | `V005/MODULE-REGISTRY/T005.md` | "唯一寫入者: 僅 D005 可寫入 T005" |
| 2 | `V005/MODULE-REGISTRY/D005.md` | "D005 為 T005/T002 Schema 的唯一寫入者" |
| 3 | `GOVERNANCE-BOOTSTRAP/DATA-CONTRACT-INDEX.md` | "D005...唯一 Listing_History 寫入權威" |

### 3.2 稽核面：AUDIT 文件記錄的實際寫入行為

| # | 稽核文件 | 記錄內容 |
|---|---------|---------|
| 1 | `T005/AUDIT/T005-READONLY-AUDIT-2026-01-22.md` | T005 GAS 直接執行 `appendRow()`, `setValues()` 等寫入 |
| 2 | `T005/AUDIT/T005-GOVERNANCE-ALIGNMENT-AUDIT-2026-01-22.md` | "T005 自身（多處寫入）" vs "D005 = 尚未觀察到實際寫入行為" |

### 3.3 寫入點對照表（來自 AUDIT）

| 檔案 | 函數 | 目標 Sheet | 實際寫入者 |
|------|------|------------|-----------|
| Main.gs | `createBusinessSheets_()` | 所有業務表 | **T005 GAS** |
| Sync.gs | `createT005Product_()` | T005-1 | **T005 GAS** |
| Sync.gs | `updateT005Product_()` | T005-1 | **T005 GAS** |
| Core.gs | `setConfig_()` | `_config` | **T005 GAS** |
| UID.gs | `createRelation_()` | `_relations` | **T005 GAS** |

### 3.4 結論判定

| 問題 | 判定 |
|------|------|
| 這是「治理宣告錯誤」還是「實際越權」？ | **治理宣告與實際架構不符** |

**詳細說明**：

- **治理宣告**：D005 是唯一寫入者，T005 是被動 Write Target
- **實際架構**：T005 GAS 自主執行所有寫入，D005 未觀察到實際寫入 T005 的行為
- **可能解釋**：
  1. D005「唯一寫入者」是指 Listing_History（C005 FACT），非 T005 商品主表
  2. 治理文件撰寫時的設計意圖，與實際實作存在落差
  3. T005 GAS 可被視為 D005 的技術實現（但未明確宣告）

**結論**：此為「治理宣告與實際架構不一致」，非單純越權。需 Architect 裁定 D005 與 T005 GAS 的關係。

---

## Task 4｜Schema Contract 位置合理性檢查

### 4.1 所有 T005 Schema Contract / Data Contract 類文件

| # | 文件路徑 | 類型 | 位於 HORUS-GOVERNANCE | 狀態標示 | 位置判定 |
|---|---------|------|---------------------|---------|---------|
| 1 | `HORUS-GOVERNANCE/T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` | Canonical Schema | ✅ 是 | ACTIVE | ✅ **合理** |
| 2 | `HORUS-FACTS/T005/T005_SHEET_SCHEMA_CANONICAL.md` | SSOT Schema | ❌ 否（在 FACTS） | SSOT | ✅ **合理**（SSOT 應在 FACTS） |
| 3 | `HORUS-GOVERNANCE/DATA_CONTRACTS/T005/T005_DATA_CONTRACT_v1.0.md` | Data Contract | ✅ 是 | DEPRECATED | ✅ **合理**（已標廢棄） |
| 4 | `HORUS-GOVERNANCE/V005/MODULE-REGISTRY/T005.md` | Module Registry | ✅ 是 | ACTIVE | ⚠️ **可接受但需更新** |
| 5 | `HORUS-GOVERNANCE/C005/C005-T005-SCHEMA-ADAPTER.md` | Schema Adapter | ✅ 是 | EFFECTIVE | ✅ **合理** |
| 6 | `HORUS-GOVERNANCE/C005/C005-T005-Field-Governance.md` | Field Governance | ✅ 是 | EFFECTIVE | ✅ **合理** |

### 4.2 位置合理性彙整

| 判定類別 | 文件數 | 說明 |
|---------|-------|------|
| ✅ **合理** | 5 | 位置正確，狀態標示正確 |
| ⚠️ **可接受但建議調整** | 1 | MODULE-REGISTRY 內容過時，位置正確但需更新內容 |
| ❌ **不合理（高治理風險）** | 0 | 無 |

### 4.3 Task 4 結論

- 所有 Schema Contract 類文件位置皆合理或可接受
- `T005_DATA_CONTRACT_v1.0.md` 已明確標示 DEPRECATED 並指向替代文件
- `MODULE-REGISTRY/T005.md` 位置正確，但內容過時需更新

---

## 彙整報告

### 一、一致項目（可凍結）

| # | 項目 | 說明 |
|---|------|------|
| 1 | Canonical Schema 定錨 | `T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` (24 欄) 為唯一權威 |
| 2 | HORUS-FACTS SSOT | `HORUS-FACTS/T005/T005_SHEET_SCHEMA_CANONICAL.md` 與 GOVERNANCE 定錨一致 |
| 3 | DEPRECATED 標示 | `T005_DATA_CONTRACT_v1.0.md` 已明確標廢棄並指向替代文件 |
| 4 | Schema Adapter 引用 | C005 相關文件皆引用 Canonical Schema |
| 5 | Schema Contract 位置 | 所有文件位於正確層級 |

### 二、不一致項目（需裁定）

| # | 項目 | 不一致內容 | 建議裁定選項 |
|---|------|-----------|-------------|
| 1 | MODULE-REGISTRY Schema | 宣告 8 欄 vs Canonical 24 欄 | A: 更新為 24 欄 / B: 移除 Schema 段落改為引用 |
| 2 | MODULE-REGISTRY 主鍵 | 宣告 `sku` vs Canonical `UID` | 必須修正 |
| 3 | D005 寫入權宣告 | 宣告 D005 唯一寫入 vs 實際 T005 GAS 寫入 | A: 釐清 D005 職責範圍 / B: 更新宣告 |
| 4 | Main.gs 28 欄 vs Canonical 24 欄 | 程式碼與治理文件欄位數不符 | 需確認 Production Sheet 實際欄位數 |

### 三、高風險但非 Runtime 問題

| # | 風險項目 | 風險等級 | 影響範圍 | 說明 |
|---|---------|---------|---------|------|
| 1 | MODULE-REGISTRY 過時 | 🔴 高 | 新進人員/新系統 | 可能導致錯誤理解與開發 |
| 2 | 寫入權宣告不一致 | 🟡 中 | 治理信任度 | 文件與實際架構不符，但不影響 Runtime |
| 3 | 欄位數衝突 | 🟡 中 | C005 index-based 讀取 | 若 24 與 28 差異在尾部，則 C005 不受影響 |

### 四、Architect 可選裁定清單（不含實作）

| # | 裁定項目 | 選項 |
|---|---------|------|
| 1 | MODULE-REGISTRY T005.md 處理方式 | A: 更新 Schema 為 24 欄 / B: 移除 Schema 改為引用連結 / C: 標記 OUTDATED |
| 2 | D005 vs T005 GAS 寫入權歸屬 | A: 宣告 T005 GAS 為 D005 技術實現 / B: 修正宣告為「T005 自主寫入」 / C: 凍結現狀不處理 |
| 3 | Production Sheet 實際欄位數確認 | A: 確認為 24 欄 / B: 確認為 28 欄 / C: 暫不確認 |
| 4 | Canonical 24 欄 vs Main.gs 28 欄 處理 | A: 以 Canonical 為準 / B: 以 Main.gs 為準 / C: 凍結現狀待後續處理 |

---

## 限制聲明

本次為 **READ-ONLY 治理盤點**：

- ❌ **未修改任何程式碼**
- ❌ **未修改任何資料結構**
- ❌ **未影響任何 runtime 行為**
- ❌ **未執行 git commit / push / reset**
- ✅ **可安全作為 Freeze / 交接依據**

---

## 證據索引

| 發現項目 | 證據來源 |
|---------|---------|
| Canonical 24 欄定義 | `HORUS-GOVERNANCE/T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` |
| MODULE-REGISTRY 8 欄 | `HORUS-GOVERNANCE/V005/MODULE-REGISTRY/T005.md` |
| DATA_CONTRACT 29 欄 (DEPRECATED) | `HORUS-GOVERNANCE/DATA_CONTRACTS/T005/T005_DATA_CONTRACT_v1.0.md` |
| Main.gs 28 欄 | `HORUS-GOVERNANCE/T005/AUDIT/T005-READONLY-AUDIT-2026-01-22.md` |
| D005 唯一寫入宣告 | `HORUS-GOVERNANCE/V005/MODULE-REGISTRY/T005.md`, `D005.md` |
| T005 GAS 實際寫入 | `HORUS-GOVERNANCE/T005/AUDIT/T005-GOVERNANCE-ALIGNMENT-AUDIT-2026-01-22.md` |

---

**Report Generated**: 2026-01-23
**Report Author**: Claude Code (READ-ONLY Governance Audit)
**Report Status**: FROZEN - 可作為交接/凍結依據

---

**END OF T005-GOVERNANCE-REPAIR-READONLY-REPORT.md**
