# GOVERNANCE-BOOTSTRAP.md

> **文件性質**：AI / Agent / 工程任務啟動前必讀清單
> **狀態**：ACTIVE
> **生效日期**：2026-01-03
> **權威落點**：`G:\我的雲端硬碟\HORUS-GOVERNANCE\GOVERNANCE-BOOTSTRAP.md`

---

## 文件定位

**本文件為所有 AI / Agent / 工程任務的啟動前必讀清單。**
**未通過本清單者，不得執行任何工程、修改、推斷、補算。**

---

## 啟動前檢查清單

### ✅ 1. Authority Check（權威確認）

> **是否已確認對應模組的 EFFECTIVE 治理文件？**

| 檢查項目 | 說明 |
|---------|------|
| 查找路徑 | `G:\我的雲端硬碟\HORUS-GOVERNANCE\DATA_CONTRACTS\{模組}\` |
| 確認狀態 | 文件 Header 必須標示 `狀態：EFFECTIVE` |
| 若無 | ⛔ **立即停止，回報 Architect** |

---

### ✅ 2. Version Scope Check（版本範圍確認）

> **此需求是否屬於 v1.x 可做？**

| 判斷基準 | 處理方式 |
|---------|---------|
| 純讀取 / 顯示 / 現有欄位操作 | ✅ 可執行 |
| 涉及語義新增 | ⛔ 一律視為 v2 候選，回報 Architect |
| 涉及 Fact 擴充 | ⛔ 一律視為 v2 候選，回報 Architect |
| 涉及欄位新增 | ⛔ 一律視為 v2 候選，回報 Architect |

---

### ✅ 3. Contract Coverage Check（契約涵蓋確認）

> **行為是否被 Data Contract 明確允許？**

| 情況 | 處理方式 |
|------|---------|
| 條文明確 KEEP | ✅ 可執行 |
| 條文標示 DEPRECATE | ⚠️ 不動，僅記錄 |
| 條文標示 FORBID | ⛔ 禁止執行 |
| 條文未涵蓋 | ⛔ **不得自行解釋，回報 Architect** |

---

### ✅ 4. Forbidden Rule Check（禁止規則確認）

> **是否觸及 FORBID / DEPRECATE 條文？**

| 檢查項目 | 說明 |
|---------|------|
| 查閱 Contract §8 Forbidden Behaviors | 確認無衝突 |
| 查閱各章節 DEPRECATE 條款 | 確認不涉及變更 |
| 若觸及 | ⛔ **禁止執行** |

---

### ✅ 5. Final Rule（最終規則）

**依 HORUS-GOVERNANCE 現行 EFFECTIVE 文件執行；若無條文，請回報 Architect。**

---

## 絕對禁止行為

| 禁止項目 | 說明 |
|---------|------|
| ❌ 不補算 | 不得因資料缺失而自行計算補值 |
| ❌ 不推斷 | 不得因「感覺合理」而推導規則 |
| ❌ 不動 Fact | 不得因資料「看起來怪」而修改 Fact 層 |
| ❌ 不改 View | 不得因使用者需求而偷加語義至 View |
| ❌ 不補 Schema | 不得自動產生 YAML / Schema |
| ❌ 不寫 Contract | Contract 必須由 Architect 核准 |
| ❌ 不合理化 NULL | NULL = UNKNOWN，不得擅自變成 0 |

---

## 權威鏈

```
HORUS-GOVERNANCE（唯一權威）
    │
    ├── GOVERNANCE-PRINCIPLES.md（治理原則）
    ├── GOVERNANCE-BOOTSTRAP.md（本文件）
    └── DATA_CONTRACTS/{模組}/（各模組契約）
            │
            └── {模組}_DATA_CONTRACT_v*.md（EFFECTIVE）
```

---

## 模組內治理資料夾規則

| 項目 | 規則 |
|------|------|
| `{模組}/_GOVERNANCE/` | 僅為工作副本，無裁決效力 |
| `{模組}/_GOVERNANCE/README.md` | 必須指向 HORUS-GOVERNANCE |
| `{模組}/_FACT_REGISTRY/` | 已裁決刪除，不再重建 |
| 模組內註解 | 僅供參考，不具契約效力 |
| AI 記憶 | 不具裁決效力 |

---

## 現行 EFFECTIVE 文件清單

| 文件 | 路徑 | 狀態 |
|------|------|------|
| GOVERNANCE-PRINCIPLES.md | `HORUS-GOVERNANCE/` | ACTIVE |
| GOVERNANCE-BOOTSTRAP.md | `HORUS-GOVERNANCE/` | ACTIVE |
| R020_DATA_CONTRACT_v1.0.md | `HORUS-GOVERNANCE/DATA_CONTRACTS/R020/` | EFFECTIVE |

---

## 啟動確認聲明

執行任何任務前，請先確認：

```
□ 已通過 Authority Check
□ 已通過 Version Scope Check
□ 已通過 Contract Coverage Check
□ 已通過 Forbidden Rule Check
□ 已確認 Final Rule
```

**若任一項未通過 → 停止執行，回報 Architect。**

---

**文件結束**

