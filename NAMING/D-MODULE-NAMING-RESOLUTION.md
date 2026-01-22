# D-Module Naming Resolution

**Status**: EFFECTIVE
**Date**: 2026-01-22
**Authority**: Architect 裁定
**Evidence**: BASE-SERVICES 全域掃描 (2026-01-22)

---

## 摘要

本文件釐清 HORUS 系統中 D001 與 D005 的命名關係，基於程式碼事實（非口語推論）。

---

## D001

| 屬性 | 值 |
|------|-----|
| **狀態** | Historical / Conceptual Alias |
| **Canonical Successor** | D005 |
| **Canonical Root** | ❌ 不存在（無 `D001-*` 資料夾）|
| **Runtime 責任** | ❌ 無獨立責任 |
| **出現位置** | C005 註解、配置描述、預留 API 呼叫 |
| **實際運行** | `FORCE_FALLBACK: true`（永久降級狀態）|

### D001 出現點分析

| 位置 | 類型 | 說明 |
|------|------|------|
| `C005/webapp/Config.js` | 配置區塊名稱 | `D001: { ... }` 配置物件 |
| `C005/webapp/D001-Integration.js` | 整合檔案 | 預留 `D001.DataHubAPI` 呼叫 |
| `C005/webapp/Utils.js` | fallback 邏輯 | `CONFIG.D001.FORCE_FALLBACK` 判斷 |

### 裁定理由

1. BASE-SERVICES 中不存在 `D001-*` 資料夾
2. 所有 `D001.DataHubAPI` 呼叫均處於 `FORCE_FALLBACK: true` 狀態
3. HORUS-GOVERNANCE 中無 D001 治理文件
4. D001 從未實際執行 Data Hub 職責

---

## D005

| 屬性 | 值 |
|------|-----|
| **狀態** | Canonical Data Module |
| **Canonical Root** | `D005-Data-Hub/`、`D005-Listing-Writer/` |
| **Runtime 責任** | Data Hub / Data Access / Listing Writer |
| **治理文件** | `V005/MODULE-REGISTRY/D005.md`、`DATA_CONTRACTS/D005/D005_DATA_CONTRACT_v1.0.md` |

### D005 承擔的實際職責

| 職責 | 實現位置 | 呼叫者 |
|------|---------|--------|
| Listing History 寫入 | `D005-Listing-Writer/Writer.js` | P0-Momo, P0-PCHOME, P0-SHOPEE, P0-Yahoo |
| FACT Sheet 讀取 | `D005_FACT_SHEET_ID` | R020 C005_SyncJob |
| GAS Library 服務 | `D005.writeObservation()` | 多個 P0-* 模組 |

### 實際呼叫證據

```javascript
// P0-Momo-Observation-Test/Main.js:41
const result = D005.writeObservations(observations);

// P0-PCHOME-Observation-Test/Main.js:484
var result = D005.writeObservation(observation);

// R020 C005_SyncJob.js:37
var D005_FACT_SHEET_ID = '1mRj894aekAHH5h9XR_n115UFtTI2GBq1n8m_moinHGA';
```

---

## 命名關係宣告

```
D001 ──[Historical Alias]──> D005
          │
          └── D001 為概念名稱，從未實現為獨立模組
          └── D005 為 Canonical 實現，承擔全部 Data Layer 職責
```

---

## Freeze 聲明

1. **D001 不再作為新模組命名使用**
2. **未來 Data Hub / Data Layer 一律以 D005 為唯一治理代號**
3. **既有程式碼中的 D001 字串無需立即修改**（屬於歷史遺留，不影響 runtime）
4. **新程式碼禁止新增 D001 引用**

---

## 驗證方法

本裁定基於以下驗證（2026-01-22 執行）：

```bash
# A1: 全域掃描
rg "D001" -n  # 結果：僅存在於 C005 註解/配置
rg "D005" -n  # 結果：存在於多個模組的實際呼叫

# A2: Canonical Root 驗證
ls | grep "^D001"  # 結果：無
ls | grep "^D005"  # 結果：D005-Data-Hub/, D005-Listing-Writer/

# A3: Runtime 責任
rg "D005\.write"   # 結果：6+ 處實際呼叫
rg "D001\."        # 結果：僅 fallback 相關判斷
```

---

## 相關文件

- `V005/MODULE-REGISTRY/D005.md` - D005 模組治理規範
- `DATA_CONTRACTS/D005/D005_DATA_CONTRACT_v1.0.md` - D005 資料契約
- `AUDIT-ENGINE/AUDIT-ENGINE-v1.1-CHANGELOG-DRAFT.md` - 審計引擎（D001 註記）

---

**END OF D-MODULE-NAMING-RESOLUTION.md**
