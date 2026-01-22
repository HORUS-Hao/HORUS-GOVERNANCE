# FIELD-SEMANTIC-CHARTER.md

> **文件性質**：欄位語義憲章（Field Semantic Charter）
> **狀態**：ACTIVE
> **版本**：v1.0
> **生效日期**：2026-01-03
> **權威來源**：Registry-HORUS-PDM.gsheet
> **權威落點**：`G:\我的雲端硬碟\HORUS-GOVERNANCE\REGISTRY\FIELD-SEMANTIC-CHARTER.md`

---

## 文件定位

本文件為「欄位語義憲章（Field Semantic Charter）」。

**用途**：將 Registry 內關鍵欄位的語義、跨層邊界、禁止事項，寫成 AI / 工程可執行規則。

**權威來源**：Registry-HORUS-PDM.gsheet

**優先順序**：
```
HORUS-GOVERNANCE > 本文件 > Registry gsheet > 模組 code 註解 / AI 記憶 / 聊天內容
```

---

## 1. 欄位語義定義

### 1.1 selling_price（我方價格）

| 項目 | 定義 |
|------|------|
| **語義** | 我方在特定平台上架的銷售價格（含稅） |
| **稅務狀態** | 含稅（Tax Included） |
| **來源層** | FACT（R020_MyPrices） |
| **允許模組** | R020, T030 |
| **狀態** | FREEZE |

**邊界規則**：
- selling_price 僅指「我方」在「特定平台」的「當前上架價格」
- 來源為平台匯出資料，非手動輸入
- 不同平台的 selling_price 獨立存在，不得跨平台聚合

**禁止事項**：
- ❌ 不得將競品價格視為 selling_price
- ❌ 不得將市場最低價視為 selling_price
- ❌ 不得將爬蟲價格視為 selling_price
- ❌ 不得從 C005 讀取作為即時比價來源

---

### 1.2 platform_cost（平台成本 / 供貨成本）

| 項目 | 定義 |
|------|------|
| **語義** | 我方在特定平台的供貨成本（含稅） |
| **稅務狀態** | 含稅（Tax Included） |
| **來源層** | FACT（R020_MyPrices） |
| **允許模組** | R020, T030 |
| **狀態** | FREEZE |

**邊界規則**：
- platform_cost 為「特定平台」的「供貨成本」
- 與 T005 的「含稅成本」(costT005) 語義不同，不得混用
- 每個平台可能有不同的 platform_cost

**禁止事項**：
- ❌ 不得與 T005「含稅成本」混用
- ❌ 不得跨平台聚合計算
- ❌ 不得將 null 視為 0

---

### 1.3 gross_profit（毛利）

| 項目 | 定義 |
|------|------|
| **語義** | selling_price − platform_cost |
| **稅務狀態** | 含稅（承繼來源欄位） |
| **來源層** | DERIVED（計算欄位） |
| **允許模組** | T030（毛利試算中心） |
| **狀態** | FREEZE |

**邊界規則**：
- gross_profit 為 DERIVED 層欄位，僅在 T030 計算
- 計算公式：`gross_profit = selling_price - platform_cost`
- 必須使用同一平台的 selling_price 與 platform_cost

**禁止事項**：
- ❌ **禁止在 T005 層計算 gross_profit**
- ❌ 不得跨平台計算（不同平台的 selling_price 與 platform_cost 不得混算）
- ❌ 不得在 Fact 層寫入 gross_profit

---

### 1.4 gross_margin_pct（毛利率）

| 項目 | 定義 |
|------|------|
| **語義** | gross_profit ÷ selling_price × 100% |
| **稅務狀態** | 百分比（無稅務屬性） |
| **來源層** | DERIVED（計算欄位） |
| **允許模組** | T030（毛利試算中心） |
| **狀態** | FREEZE |

**邊界規則**：
- gross_margin_pct 為 DERIVED 層欄位，僅在 T030 計算
- 計算公式：`gross_margin_pct = (gross_profit / selling_price) * 100`
- 當 selling_price = 0 或 null 時，gross_margin_pct = null（不得為 0）

**禁止事項**：
- ❌ **禁止在 T005 層計算 gross_margin_pct**
- ❌ 不得將計算結果寫入 Fact 層
- ❌ 不得將 null 結果視為 0%

---

## 2. Registry 核心規則

### 2.1 欄位定義規則（源自 Registry_Fields）

| 規則 | 說明 |
|------|------|
| **definition 唯一性** | 每個欄位的 definition 由 Registry 定義，不得由程式碼或 AI 自行解釋 |
| **tax_included 明確性** | 每個金額欄位必須明確標示是否含稅，不得模糊 |
| **source_layer 邊界** | 欄位僅能從指定的 source_layer 讀取，不得跨層取值 |
| **allowed_modules 限制** | 欄位僅能被 allowed_modules 列出的模組使用 |
| **FREEZE 狀態** | 標記為 FREEZE 的欄位，其語義、來源、計算邏輯一律凍結，不得變更 |

### 2.2 欄位對應規則（源自 T005_Field_Mapping）

| 規則 | 說明 |
|------|------|
| **禁止 T005 層計算** | gross_profit、gross_margin_pct 等 DERIVED 欄位，不得在 T005 層計算或推算 |
| **只允許引用 Registry 定義** | 所有欄位對應必須引用 Registry 定義，不得自造 mapping |
| **欄位名稱一致性** | 跨模組引用時，必須使用 Registry 定義的正式欄位名稱 |

---

## 3. 禁止誤用章節

### 3.1 價格語義誤用禁止

| 禁止項目 | 說明 |
|---------|------|
| ❌ competitors[].price 不得視為 selling_price | 競品價格是「他方價格」，與「我方價格」語義不同 |
| ❌ 市場最低價不得視為 selling_price | marketMin 是市場數據，非我方定價 |
| ❌ 爬蟲價格不得視為 selling_price | 爬蟲抓取的價格為外部數據，非我方系統價格 |

### 3.2 跨層讀取禁止

| 禁止項目 | 說明 |
|---------|------|
| ❌ View/Observer 層不得讀取 HORUS-FACTS 進行我方/競品判定 | 此行為屬於 v2 Fact 語義擴充，v1.x 禁止 |
| ❌ View 層不得寫回 Fact 層 | View 僅供顯示，不得修改 Fact 數據 |
| ❌ DERIVED 層不得反向影響 FACT 層 | 計算結果不得回寫至來源數據 |

### 3.3 欄位對應缺失處理

| 情況 | 唯一允許行為 |
|------|-------------|
| 欄位對應缺失 | ⛔ **回報 Architect** |
| 欄位語義不明 | ⛔ **回報 Architect** |
| 新欄位需求 | ⛔ **回報 Architect** |

**絕對禁止**：
- ❌ 不得自造 mapping
- ❌ 不得從程式碼推斷欄位對應
- ❌ 不得從 AI 記憶或聊天內容推斷

---

## 4. 層級邊界總覽

```
┌─────────────────────────────────────────────────────────┐
│ GOVERNANCE（治理層）                                      │
│   - Registry-HORUS-PDM.gsheet（欄位定義 SSOT）            │
│   - FIELD-SEMANTIC-CHARTER.md（本文件）                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ FACT（事實層）                                            │
│   - T005：商品主檔（含稅成本、品牌、供應商...）              │
│   - R020_MyPrices：我方上架價格（selling_price）           │
│   - R020_CompareResult：比價結果                          │
│   ⚠️ 禁止在此層計算 gross_profit / gross_margin_pct       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ DERIVED（衍生層）                                         │
│   - T030：毛利試算中心                                    │
│   - 允許計算：gross_profit, gross_margin_pct              │
│   ⚠️ 計算結果不得回寫 FACT 層                              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ VIEW（顯示層）                                            │
│   - Web / Mail / Dashboard                               │
│   - 僅讀取顯示，不得修改任何上層數據                         │
│   ⚠️ 不得讀取 HORUS-FACTS 進行我方/競品判定                 │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Changelog

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0 | 2026-01-03 | 建立憲章，涵蓋 selling_price、platform_cost、gross_profit、gross_margin_pct 四個欄位語義定義與禁止事項 |

---

**文件結束**

